import * as JWT from 'jsonwebtoken'
import { API as CallOfDutyAPI, Schema } from '@stagg/callofduty'
import axios from 'axios'
import {
    FAAS_ETL_COD_TTL,
    FAAS_ETL_COD_HOST,
    USER_NOT_FOUND_ERR,
    API_HOST,
} from './config'

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
    account: {
        accountId: string
        userId: string
        unoId: string
        profiles: ProfileId[]
    }
}

interface CompatibilityItem {
    gameIds: Schema.API.Game[]
    gameTypes: Schema.API.GameType[]
}
interface CompatibilityTable {
    unoId: CompatibilityItem
    friends: CompatibilityItem
    matchEvents: CompatibilityItem
    matchDetails: CompatibilityItem
    matchSummary: CompatibilityItem
}
const compatibility:CompatibilityTable = {
    unoId: { gameIds: ['mw'], gameTypes: ['mp', 'wz'] },
    friends: { gameIds: ['mw'], gameTypes: ['mp', 'wz'] },
    matchEvents: { gameIds: ['mw'], gameTypes: ['mp'] },
    matchDetails: { gameIds: ['mw'], gameTypes: ['mp', 'wz'] },
    matchSummary: { gameIds: ['mw'], gameTypes: ['mp', 'wz'] },
}

interface ProfileId { username: string, platform: Schema.API.Platform }
interface FriendId extends ProfileId { unoId: string }

const parseUrl = (url:string) => url.split('#').join('%23')

export namespace Worker {
    interface Config {
        gameId: Schema.API.Game
        gameType: Schema.API.GameType
        authTokens: Schema.API.Tokens
        startTime?: number
        username?: string
        platform?: Schema.API.Platform
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
        private hardStopReached:boolean
        private readonly accountId:string
        private readonly profiles:ProfileId[]
        private readonly API:CallOfDutyAPI
        private readonly hrtimeStart:[number,number]
        private readonly originalCfg:Config
        constructor(
            private readonly jwt:string,
            private readonly cfg:Config,
            private readonly options?:Partial<Options>,
        ) {
            this.hardStopReached = false
            this.hrtimeStart = process.hrtime()
            if (!this.cfg.startTime) {
                this.cfg.startTime = 0
            }
            this.API = new CallOfDutyAPI(this.cfg.authTokens)
            this.options = {
                unoId: true,
                identity: true,
                redundancy: false,
                platformIds: true,
                profileData: false,
                friendsList: false,
                matchEvents: false,
                matchSummary: false,
                matchDetails: false,
                accountDiscovery: false,
                deleteInvalidProfiles: true,
                ...this.options,
            }
            this.originalCfg = cfg
            const { account } = JWT.decode(this.jwt) as IntegrityToken
            this.accountId = account.accountId
            this.profiles = account.profiles
        }
        private get HttpHeaders() {
            return { headers: { 'X-Integrity-Token': this.jwt } }
        }
        public async Run() {
            await this.ExecuteOnce()
            while(!this.hardStopReached) {
                await this.ExecuteCycle()
            }
        }
        // private HttpGet(url:string) {
        //     return axios.get(parseUrl(url), this.Headers)
        // }
        private HttpPut(url:string, payload?:any) {
            console.log('[^] PUT', url)
            return axios.put(parseUrl(url), payload, this.HttpHeaders)
        }
        private HttpPost(url:string, payload?:any) {
            console.log('[^] POST', url)
            return axios.post(parseUrl(url), payload, this.HttpHeaders)
        }
        private HttpPatch(url:string, payload?:any) {
            console.log('[^] PATCH', url)
            return axios.patch(parseUrl(url), payload, this.HttpHeaders)
        }
        private HttpDelete(url:string) {
            console.log('[^] DELETE', url)
            return axios.delete(parseUrl(url), this.HttpHeaders)
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
                const { username, platform } = profilesByGame[this.cfg.gameId]
                this.cfg.username = username
                this.cfg.platform = platform
                await this.SaveAccountPlatformId(username, platform)
            }
            // Platform profiles
            if (this.ShouldExecuteFeature('platformIds')) {
                const invalidProfiles = [...this.profiles]
                const profileIds = await this.FetchPlatformIds()
                for(const { platform, username } of profileIds) {
                    await this.SaveAccountPlatformId(username, platform)
                    invalidProfiles.forEach((p,i) => {
                        if (p.username === username && p.platform === platform) {
                            delete invalidProfiles[i]
                        }
                    })
                }
                for(const { platform, username } of invalidProfiles.filter(p => p)) {
                    await this.DeleteInvalidProfile(username, platform)
                }
            }
            // Friends list
            if (this.ShouldExecuteFeature('friendsList')) {
                const friends = await this.FetchFriendsList()
                await this.SaveFriendsList(friends)
                if (this.ShouldExecuteFeature('accountDiscovery')) {
                    for(const { unoId, username, platform } of friends) {
                        await this.SaveDiscoveredAccount('friend', this.cfg.gameId, unoId, username, platform)
                    }
                }
            }
            // Profile data by gameId/gameType
            try {
                const profileData = await this.FetchProfileData()
                await this.SaveProfileData(profileData)
            } catch(e) {
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
            for(const match of matchListRes.matches) {
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
                } catch(e) {
                    existingMatches++
                    continue // match already exists
                }
                if (this.ShouldExecuteFeature('matchSummary')) {
                    const matchSummary = await this.API.MatchSummary(match)
                    await this.UpdateMatchRecord(match.matchID, matchSummary.summary.all)
                }
                if (this.ShouldExecuteFeature('matchEvents')) {
                    const matchEvents = await this.API.MatchEvents(match.matchID)
                    await this.SaveMatchEvents(matchEvents)
                }
                if (this.ShouldExecuteFeature('matchDetails') && this.ShouldExecuteFeature('accountDiscovery')) {
                    const matchDetails = await this.API.MatchDetails(match.matchID)
                    for(const matchRecord of matchDetails.allPlayers) {
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
        private ShouldSpawnSibling():boolean {
            const [execTimeSec] = process.hrtime(this.hrtimeStart)
            return execTimeSec >= FAAS_ETL_COD_TTL
        }
        private ShouldExecuteFeature(
            feature: 'unoId' | 'identity' | 'platformIds' | 'profileData' | 'friendsList' |
                     'matchEvents' | 'matchDetails' | 'matchSummary' |
                     'deleteInvalidProfiles' | 'accountDiscovery'
        ):boolean {
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
        private async FetchIdentities():Promise<{ [key:string]: ProfileId }> {
            const profilesByGame:{ [key:string]: ProfileId } = {}
            const { titleIdentities } = await this.API.Identity()
            for(const { title, username, platform } of titleIdentities) {
                profilesByGame[title] = { username, platform }
            }
            return profilesByGame
        }
        private async FetchPlatformIds():Promise<ProfileId[]> {
            const profileIds:ProfileId[] = []
            const platformsRes = await this.API.Platforms(this.cfg.username, this.cfg.platform)
            for(const platform in platformsRes) {
                profileIds.push({ platform: platform as Schema.API.Platform, username: platformsRes[platform].username })
            }
            return profileIds
        }
        private async FetchFriendsList():Promise<FriendId[]> {
            const friends:FriendId[] = []
            const friendsRes = await this.API.Friends()
            for(const { username, platform, accountId } of friendsRes.uno) {
                friends.push({ username, platform, unoId: accountId })
            }
            return friends
        }
        private async FetchProfileData() {
            return this.API.Profile(this.cfg.username, this.cfg.platform, this.cfg.gameType, this.cfg.gameId)
        }
        private async FetchMatchList() {
            const { username, platform, gameType, gameId, startTime } = this.cfg
            const matchListRes = await this.API.MatchList(username, platform, gameType, gameId, startTime)
            if (!matchListRes.matches || !matchListRes.matches.length) {
                throw `no matches returned for ${this.cfg.gameId}/${this.cfg.gameType}/${this.cfg.platform}/${this.cfg.username}`
            }
            return matchListRes
        }
        private async SaveAccountUnoId(unoId:string) {
            try {
                await this.HttpPut(`${API_HOST}/callofduty/account/${this.accountId}/unoId/${unoId}`)
                return true
            } catch(e) {
                console.log('[>] SaveAccountUnoId Error consumed', e.message)
                return false
            }
        }
        private async SaveAccountPlatformId(username:string, platform:Schema.API.Platform) {
            try {
                await this.HttpPut(`${API_HOST}/callofduty/account/${this.accountId}/profile/${platform}/${username}`)
                return true
            } catch(e) {
                console.log('[>] SaveAccountPlatformId Error consumed', e.message)
                return false
            }
        }
        private async SaveDiscoveredAccount(origin:Schema.DB.Account.Origin, gameId:Schema.API.Game, unoId:string, username?:string, platform?:Schema.API.Platform) {
            try {
                const suffix = username && platform ? `/${platform}/${username}` : ''
                await this.HttpPut(`${API_HOST}/callofduty/account/${origin}/${gameId}/${unoId}${suffix}`)
                return true
            } catch(e) {
                console.log('[>] SaveDiscoveredAccount Error consumed', e.message)
                return false
            }
        }
        private async SaveFriendsList(friendsList:FriendId[]) {
            try {
                const { gameId, gameType, platform, username } = this.cfg
                await this.HttpPut(`${API_HOST}/callofduty/friends/${gameId}/${gameType}/${platform}/${username}`, friendsList)
                return true
            } catch(e) {
                console.log('[>] SaveFriendsList Error consumed', e.message)
                return false
            }
        }
        private async SaveProfileData(profileRes:Schema.API.MW.Routes.Profile) {
            try {
                const { gameId, gameType, platform, username } = this.cfg
                await this.HttpPut(`${API_HOST}/callofduty/profile/${gameId}/${gameType}/${platform}/${username}`, profileRes)
                return true
            } catch(e) {
                console.log('[>] SaveProfileData Error consumed', e.message)
                return false
            }
        }
        private async DeleteInvalidProfile(username:string, platform:Schema.API.Platform) {
            try {
                await this.HttpDelete(`${API_HOST}/callofduty/account/${this.accountId}/profile/${platform}/${username}`)
                return true
            } catch(e) {
                console.log('[>] DeleteInvalidProfile Error consumed', e.message)
                return false
            }
        }
        private async SaveMatchEvents(matchMapEventsRes:Schema.API.MW.Routes.MatchMapEvents) {
            try {
                await this.HttpPut(`${API_HOST}/callofduty/match/${this.cfg.gameId}/${this.cfg.gameType}/${matchMapEventsRes.matchId}/events`, matchMapEventsRes)
                return true
            } catch(e) {
                console.log('[>] SaveMatchEvents Error consumed', e.message)
                return false
            }
        }
        private async SaveMatchRecord(match:Schema.API.MW.Match, isForeignAcct?:boolean) {
            try {
                const { gameId, gameType, platform, username } = this.cfg
                const url = this.ShouldExecuteFeature('unoId') ? match.player.uno : `${platform}/${username}`
                if (isForeignAcct && !this.ShouldExecuteFeature('unoId')) {
                    throw `cannot save match record on foreign account without unoId for ${gameId}/${gameType}/${match.matchID}`
                }
                await this.HttpPut(`${API_HOST}/callofduty/match/${gameId}/${gameType}/${match.matchID}/${url}`, match)
                return true
            } catch(e) {
                console.log('[>] SaveMatchRecord Error consumed', e.response.request.data.message)
                return false
            }
        }
        private async UpdateMatchRecord(matchId:string, summary:Schema.API.MW.Summary) {
            try {
                const { gameId, gameType, platform, username } = this.cfg
                await this.HttpPatch(`${API_HOST}/callofduty/match/${gameId}/${gameType}/${matchId}/${platform}/${username}`, { avgLifeTime: summary.avgLifeTime })
                return true
            } catch(e) {
                console.log('[>] UpdateMatchRecord Error consumed', e.message)
                return false
            }
        }
    }
    
}


