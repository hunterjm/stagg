import * as JWT from 'jsonwebtoken'
import { API, Schema } from 'callofduty'
import axios from 'axios'
import {
    FAAS_ETL_COD_TTL,
    FAAS_ETL_COD_HOST,
    USER_NOT_FOUND_ERR,
} from './config'
import { getCustomRepository } from 'typeorm'
import { CallOfDuty } from '@stagg/db'
import { CallOfDutyMatchService } from './match'

/************************************************************************************************************
 * ETL PROCESS:
 * 1. Decode accountId and profiles from JWT
 * 2. Execute cycle until hardStopReached
 *  2-1. Check execution time
 *      2-1-1. If near timeout, spawn sibling and hardStop
 *  2-2. Fetch identity and save account profile (if applicable)
 *  2-3. Fetch all profiles, save returned profiles and delete invalid/missing profiles (if applicable)
 *  2-4. Fetch friends list, save friends' profiles, and save discovered friend accounts (if applicable)
 *  2-5. Fetch game/type specific profile data and save profile data (if applicable)
 *  2-6. Fetch recent match history, for every match:
 *      2-6-1. Save match record for current account
 *          2-6-1-1. If already exists and redundancy disabled, skip the rest of 2-6...
 *      2-6-2. Save unoId for current account (if applicable)
 *      2-6-3. Fetch isolated match summary and save avgLifeTime for current account (if applicable)
 *      2-6-4. Fetch and save match events (if applicable)
 *      2-6-5. Fetch and save match details (if applicable), for every player:
 *          2-6-5-1. Save discovered account (if applicable)
 *          2-6-5-2. Save match record (if account discovery successful)
 ***********************************************************************************************************/

// Last shallow ETL (recent 20)
// Last deep ETL (redundancy scrape) - do this once on sign-up and after outages
// Two timestamps, lastInquiry and lastDiscovery to signal when it was last selected and the last time it actually found something new

interface Headers {
    'x-integrity-jwt': string
}
interface IntegrityToken {
    accountId: string
    userId: string
    unoId: string
    profiles: Schema.ProfileId[]
}

interface CompatibilityItem {
    gameIds: Schema.Game[]
    gameTypes: Schema.GameType[]
}
interface CompatibilityTable {
    unoId: CompatibilityItem
    friends: CompatibilityItem
    matchEvents: CompatibilityItem
    matchDetails: CompatibilityItem
    matchSummary: CompatibilityItem
}
const compatibility: CompatibilityTable = {
    unoId: { gameIds: ['mw'], gameTypes: ['mp', 'wz'] },
    friends: { gameIds: ['mw'], gameTypes: ['mp', 'wz'] },
    matchEvents: { gameIds: ['mw'], gameTypes: ['mp'] },
    matchDetails: { gameIds: ['mw'], gameTypes: ['mp', 'wz'] },
    matchSummary: { gameIds: ['mw'], gameTypes: ['mp', 'wz'] },
}

// interface ProfileId { username: string, platform: Schema.Platform }
// interface FriendId extends ProfileId { unoId: string }

const parseUrl = (url: string) => url.split('#').join('%23')

export namespace Worker {
    interface Config {
        gameId: Schema.Game
        gameType: Schema.GameType
        authTokens: Schema.Tokens
        startTime?: number
        username?: string
        platform?: Schema.Platform
    }
    interface Options {
        unoId: boolean
        identity: boolean
        redundancy: boolean
        platformIds: boolean
        profileData: boolean
        friendsList: boolean
        matchEvents: boolean
        matchDetails: boolean
        matchSummary: boolean
        accountDiscovery: boolean
        deleteInvalidProfiles: boolean
    }
    export class Instance {
        private hardStopReached: boolean
        private readonly API: API
        private readonly accountId: string
        private readonly profiles: Schema.ProfileId[]
        private readonly hrtimeStart: [number, number]
        private readonly originalCfg: Config
        private readonly accountRepo: CallOfDuty.Account.Base.Repository
        private readonly authRepo: CallOfDuty.Account.Auth.Repository
        private readonly profileRepo: CallOfDuty.Account.Profile.Repository
        private readonly callofdutyMatchService: CallOfDutyMatchService
        constructor(
            private readonly jwt: string,
            private readonly cfg: Config,
            private readonly options?: Partial<Options>,
        ) {
            this.hardStopReached = false
            this.hrtimeStart = process.hrtime()
            if (!this.cfg.startTime) {
                this.cfg.startTime = 0
            }
            this.API = new API(this.cfg.authTokens)
            this.options = {
                unoId: true,
                identity: true,
                redundancy: false,
                platformIds: true,
                profileData: false,
                friendsList: false,
                matchEvents: false,
                matchSummary: true,
                matchDetails: false,
                accountDiscovery: false,
                deleteInvalidProfiles: true,
                ...this.options,
            }
            this.originalCfg = cfg
            const { accountId, profiles } = JWT.decode(this.jwt) as IntegrityToken
            this.accountId = accountId
            this.profiles = profiles
            this.accountRepo = getCustomRepository(CallOfDuty.Account.Base.Repository)
            this.authRepo = getCustomRepository(CallOfDuty.Account.Auth.Repository)
            this.profileRepo = getCustomRepository(CallOfDuty.Account.Profile.Repository)
            this.callofdutyMatchService = new CallOfDutyMatchService();
        }
        private get HttpHeaders() {
            return { headers: { 'x-integrity-jwt': this.jwt } }
        }
        public async Run() {
            await this.ExecuteOnce()
            while (!this.hardStopReached) {
                await this.ExecuteCycle()
            }
        }
        // private HttpGet(url:string) {
        //     return axios.get(parseUrl(url), this.Headers)
        // }
        private HttpPost(url:string, payload?:any) {
            console.log('[^] POST', url)
            return axios.post(parseUrl(url), payload, this.HttpHeaders)
        }
        private HardStop() {
            this.hardStopReached = true
        }
        private async ExecuteOnce() {
            // Platform profile by gameId
            if (this.ShouldExecuteFeature('identity')) {
                const profilesByGame = await this.FetchIdentities()
                if (!profilesByGame[this.cfg.gameId]) {
                    throw `No identity found for ${this.cfg.gameId} on account ${this.accountId}`
                }
                const { username, platform } = <Schema.ProfileId.PlatformId>profilesByGame[this.cfg.gameId]
                this.cfg.username = username
                this.cfg.platform = platform
                await this.SaveAccountPlatformId(username, platform)
            }
            // Platform profiles
            if (this.ShouldExecuteFeature('platformIds')) {
                const invalidProfiles = [...this.profiles]
                const profileIds = await this.FetchPlatformIds()
                for (const { platform, username } of <Schema.ProfileId.PlatformId[]>profileIds) {
                    await this.SaveAccountPlatformId(username, platform)
                    invalidProfiles.forEach((p: any, i) => {
                        if (p.username === username && p.platform === platform) {
                            delete invalidProfiles[i]
                        }
                    })
                }
                for (const { platform, username } of <Schema.ProfileId.PlatformId[]>invalidProfiles.filter(p => p)) {
                    await this.DeleteInvalidProfile(username, platform)
                }
            }
            // Friends list
            if (this.ShouldExecuteFeature('friendsList')) {
                const friends = await this.FetchFriendsList()
                await this.SaveFriendsList(friends)
                if (this.ShouldExecuteFeature('accountDiscovery')) {
                    for (const { unoId, username, platform } of <(Schema.ProfileId.UnoId & Schema.ProfileId.PlatformId)[]>friends) {
                        await this.SaveDiscoveredAccount('friend', this.cfg.gameId, unoId, username, platform)
                    }
                }
            }
            // Profile data by gameId/gameType
            try {
                const profileData = await this.FetchProfileData()
                await this.SaveProfileData(profileData)
            } catch (e) {
                if (e === USER_NOT_FOUND_ERR && this.ShouldExecuteFeature('deleteInvalidProfiles')) {
                    await this.DeleteInvalidProfile(this.cfg.username, this.cfg.platform)
                    throw `invalid profile for "${this.cfg.username}" on platform "${this.cfg.platform}"`
                }
            }
        }
        private async ExecuteCycle() {
            if (this.ShouldSpawnSibling()) {
                await this.SpawnSiblingInstance()
                this.HardStop()
                return
            }
            // Match data
            let existingMatches = 0
            const matchListRes = await this.FetchMatchList()
            for (const match of matchListRes.matches) {
                // check if we need to increase next startTime
                const normalizedStartTime = (match.utcStartSeconds - 5) * 1000
                if (!this.cfg.startTime || this.cfg.startTime > normalizedStartTime) {
                    this.cfg.startTime = normalizedStartTime
                }
                // Save unoId first in case its saving matches on unoId
                if (this.ShouldExecuteFeature('unoId')) {
                    await this.SaveAccountUnoId(match.player.uno)
                }
                try {
                    await this.SaveMatchRecord(match)
                } catch (e) {
                    existingMatches++
                    continue // match already exists
                }
                if (this.ShouldExecuteFeature('matchSummary')) {
                    const matchSummary = await this.API.MatchSummary(match, this.cfg.gameId)
                    await this.UpdateMatchRecord(match.matchID, matchSummary.summary.all)
                }
                if (this.ShouldExecuteFeature('matchEvents')) {
                    const matchEvents = await this.API.MatchEvents(match.matchID, this.cfg.gameId)
                    await this.SaveMatchEvents(matchEvents)
                }
                if (this.ShouldExecuteFeature('matchDetails') && this.ShouldExecuteFeature('accountDiscovery')) {
                    const matchDetails = await this.API.MatchDetails(match.matchID, this.cfg.gameType, this.cfg.gameId)
                    for (const matchRecord of matchDetails.allPlayers) {
                        const { uno } = matchRecord.player
                        console.log('Saving unoId account', uno)
                        await this.SaveDiscoveredAccount('enemy', this.cfg.gameId, uno)
                        await this.SaveMatchRecord(matchRecord, true)
                    }
                }
            }
            if (existingMatches === matchListRes.matches.length) {
                console.log('[.] All returned matches already exist, exiting...')
                this.HardStop()
                return
            }
        }
        private async SpawnSiblingInstance() {
            return this.HttpPost(FAAS_ETL_COD_HOST, this.cfg)
        }
        private ShouldSpawnSibling(): boolean {
            const [execTimeSec] = process.hrtime(this.hrtimeStart)
            return execTimeSec >= FAAS_ETL_COD_TTL
        }
        private ShouldExecuteFeature(
            feature: 'unoId' | 'identity' | 'platformIds' | 'profileData' | 'friendsList' |
                'matchEvents' | 'matchDetails' | 'matchSummary' |
                'deleteInvalidProfiles' | 'accountDiscovery'
        ): boolean {
            if (feature === 'identity') {
                return this.options.identity && Boolean(this.originalCfg.username && this.originalCfg.platform)
            }
            if (feature === 'accountDiscovery') {
                return this.options.accountDiscovery
            }
            if (feature === 'platformIds') {
                return this.options.identity && Boolean(this.originalCfg.username && this.originalCfg.platform)
            }
            if (feature === 'deleteInvalidProfiles') {
                return this.options.deleteInvalidProfiles
            }
            return this.options[feature] && compatibility[feature] && compatibility[feature].gameIds.includes(this.cfg.gameId)
        }
        private async FetchIdentities(): Promise<{ [key: string]: Schema.ProfileId }> {
            const profilesByGame: { [key: string]: Schema.ProfileId } = {}
            const { titleIdentities } = await this.API.Identity()
            for (const { title, username, platform } of titleIdentities) {
                profilesByGame[title] = { username, platform }
            }
            return profilesByGame
        }
        private async FetchPlatformIds(): Promise<Schema.ProfileId[]> {
            const profileIds: Schema.ProfileId[] = []
            const { username, platform } = this.cfg
            const accountsRes = await this.API.Accounts({ username, platform })
            for (const platform in accountsRes) {
                profileIds.push({ platform: platform as Schema.Platform, username: accountsRes[platform].username })
            }
            return profileIds
        }
        private async FetchFriendsList(): Promise<Schema.ProfileId[]> {
            const friends: Schema.ProfileId[] = []
            const friendsRes = await this.API.Friends()
            for (const { username, platform, accountId } of friendsRes.uno) {
                friends.push({ username, platform, unoId: accountId })
            }
            return friends
        }
        private async FetchProfileData() {
            const { username, platform } = this.cfg
            return this.API.Profile({ username, platform }, this.cfg.gameType, this.cfg.gameId)
        }
        private async FetchMatchList() {
            const { username, platform, gameType, gameId, startTime } = this.cfg
            const matchListRes = await this.API.MatchHistory({ username, platform }, gameType, gameId, startTime)
            if (!matchListRes.matches || !matchListRes.matches.length) {
                throw `no matches returned for ${this.cfg.gameId}/${this.cfg.gameType}/${this.cfg.platform}/${this.cfg.username}`
            }
            return matchListRes
        }
        private async SaveAccountUnoId(unoId: string) {
            try {
                await this.accountRepo.updateAccountUnoId(this.accountId, unoId)
                return true
            } catch (e) {
                console.log('[>] SaveAccountUnoId Error consumed', e.message)
                return false
            }
        }
        private async SaveAccountPlatformId(username: string, platform: Schema.Platform) {
            try {
                const account = await this.accountRepo.findOneOrFail(this.accountId)
                const auth = await this.authRepo.findByAccountId(this.accountId)
                const profile = await this.profileRepo.findByUsernamePlatform(username, platform)
                if (!profile) {
                    await this.profileRepo.insertProfile({ account, platform, username, games: auth?.games })
                }
                return true
            } catch (e) {
                console.log('[>] SaveAccountPlatformId Error consumed', e.message)
                return false
            }
        }
        private async SaveDiscoveredAccount(origin: 'friend' | 'enemy', gameId: Schema.Game, unoId: string, username?: string, platform?: Schema.Platform) {
            try {
                // const suffix = username && platform ? `/${platform}/${username}` : ''
                // await this.HttpPut(`${API_HOST}/callofduty/account/${origin}/${gameId}/${unoId}${suffix}`)
                // TODO: check if this is implemented or not
                return true
            } catch (e) {
                console.log('[>] SaveDiscoveredAccount Error consumed', e.message)
                return false
            }
        }
        // callofduty.friends.controller line 12
        private async SaveFriendsList(friendsList: Schema.ProfileId[]) {
            try {
                // const { gameId, gameType, platform, username } = this.cfg
                // await this.HttpPut(`${API_HOST}/callofduty/friends/${gameId}/${gameType}/${platform}/${username}`, friendsList)
                // not implemented
                return true
            } catch (e) {
                console.log('[>] SaveFriendsList Error consumed', e.message)
                return false
            }
        }
        // callofduty.profile.controller line 18
        private async SaveProfileData(profileRes: Schema.Routes.Profile) {
            try {
                // const { gameId, gameType, platform, username } = this.cfg
                // await this.HttpPut(`${API_HOST}/callofduty/profile/${gameId}/${gameType}/${platform}/${username}`, profileRes)
                // not implemented
                return true
            } catch (e) {
                console.log('[>] SaveProfileData Error consumed', e.message)
                return false
            }
        }
        private async DeleteInvalidProfile(username: string, platform: Schema.Platform) {
            try {
                await this.accountRepo.findOneOrFail(this.accountId)
                await this.profileRepo.deleteForAccountId(this.accountId, username, platform)
                return true
            } catch (e) {
                console.log('[>] DeleteInvalidProfile Error consumed', e.message)
                return false
            }
        }
        // callofduty.match.controller line 39
        private async SaveMatchEvents(matchMapEventsRes: Schema.Routes.MatchEvents) {
            try {
                // await this.HttpPut(`${API_HOST}/callofduty/match/${this.cfg.gameId}/${this.cfg.gameType}/${matchMapEventsRes.matchId}/events`, matchMapEventsRes)
                // not implemented
                return true
            } catch (e) {
                console.log('[>] SaveMatchEvents Error consumed', e.message)
                return false
            }
        }
        // callofduty.match.controller line 43 and line 69
        private async SaveMatchRecord(match: Schema.Match, isForeignAcct?: boolean) {
            try {
                const { gameId, gameType, platform, username } = this.cfg
                if (isForeignAcct && !this.ShouldExecuteFeature('unoId')) {
                    throw `cannot save match record on foreign account without unoId for ${gameId}/${gameType}/${match.matchID}`
                }
                // pull account by unoId OR username/platform
                let account: CallOfDuty.Account.Base.Entity
                if (this.ShouldExecuteFeature('unoId')) {
                    account = await this.accountRepo.findOneOrFailByUnoId(match.player.uno)
                } else {
                    const profile = await this.profileRepo.findByUsernamePlatform(username, platform)
                    if (!profile) {
                        throw `user profile not found`
                    }
                    account = profile.account
                }
                await this.callofdutyMatchService.insertMatchRecord(account, gameId, gameType, match)
                // inserting match recrod into match table
                return true
            } catch (e) {
                console.log('[>] SaveMatchRecord Error consumed', e.response.request.data.message)
                return false
            }
        }
        // callofduty.match.controller line 82
        private async UpdateMatchRecord(matchId: string, summary: Schema.Summary) {
            try {
                const { gameId, gameType, platform, username } = this.cfg
                const profile = await this.profileRepo.findByUsernamePlatform(username, platform)
                if (!profile) {
                    throw `user profile not found`
                }
                await this.callofdutyMatchService.updateMatchRecord(matchId, profile.account.accountId, gameId, gameType, { avgLifeTime: summary.avgLifeTime })
                return true
            } catch (e) {
                console.log('[>] UpdateMatchRecord Error consumed', e.message)
                return false
            }
        }
    }
}


