/************************************************************************************************************
 * ETL PROCESS:
 * 1. Decode accountId and profiles from JWT
 * 2. Execute cycle until hardStopReached
 *  2-1. Check execution time
 *      2-1-1. If near timeout, spawn sibling and hardStop
 *  2-2. Fetch all profiles; save returned profiles; delete invalid/missing profiles (if applicable)
 *  2-3. Fetch friends list, save friends' unoIds; delete old friends (if applicable)
 *  2-4. Fetch game/type specific profile data and save profile data (if applicable)
 *  2-5. Fetch recent match history, for every match:
 *      2-5-1. Save match record for current account
 *          2-5-1-1. If already exists and redundancy disabled, skip the rest of 2-5-*...
 *      2-5-2. Save unoId for current account (if applicable)
 *      2-5-3. Fetch isolated match summary and save avgLifeTime for current account (if applicable)
 ***********************************************************************************************************/
import axios from 'axios'
import * as DB from '@stagg/db'
import * as CallOfDuty from '@callofduty/types'
import CallOfDutyAPI from '@callofduty/api'
import { ScraperService } from './service'
import { CONFIG } from './config'

export class Worker {
    private api:CallOfDutyAPI
    private scraperService:ScraperService
    private perferredProfileId:CallOfDuty.ProfileId
    private hardStopReached:boolean = false
    private readonly hrtimeStart = process.hrtime()
    constructor(
        private readonly account:DB.Account.Entity,
        private readonly redundancy:boolean = false,
        private readonly startTimes = { mw: 0, cw: 0, wz: 0 },
    ) {
        this.scraperService = new ScraperService(this.account, this.redundancy)
        this.api = new CallOfDutyAPI(this.account.callofduty_authorization_tokens)
    }
    public async Run() {
        // only execute if its fetching the latest data (eg: not a nested fetch/call)
        await this.SetPreferredIdentity()
        if (Math.max(...Object.values(this.startTimes)) === 0) {
            await this.RefreshIdentities()
            await this.RefreshFriends()
            await this.RefreshProfileData()
        }
        while(!this.hardStopReached) {
            console.log(`[^] Executing cycle; execution time ${process.hrtime(this.hrtimeStart)[0]}s`)
            await this.scraperService.refreshUpdatedDateTime()
            if (Math.max(...Object.values(this.startTimes)) < 0) {
                this.hardStopReached = true
                console.log('[@] Stopping execution; all start times < 0', JSON.stringify(this.startTimes))
            }
            if (this.ShouldSpawnSibling()) {
                await this.SpawnSiblingInstance()
                this.hardStopReached = true
                return
            }
            await this.RefreshMatchHistory()
        }
    }
    private async SpawnSiblingInstance() {
        const siblingUrl = `${CONFIG.SELF_HOST}?redundancy=true`+
            `&account_id=${this.account.account_id}`+
            `&mw_end=${this.startTimes.mw}`+
            `&wz_end=${this.startTimes.wz}`+
            `&cw_end=${this.startTimes.cw}`
        console.log(`[$] Spawning sibling instance ${siblingUrl}`)
        axios.get(siblingUrl)
    }
    private ShouldSpawnSibling(): boolean {
        const [execTimeSec] = process.hrtime(this.hrtimeStart)
        return execTimeSec >= CONFIG.MAX_EXECUTION_TIME
    }
    private async SetPreferredIdentity() {
        const { titleIdentities: [firstTitleIdentity] } = await this.api.Identity()
        const { username, platform } = firstTitleIdentity
        this.perferredProfileId = { username, platform }
    }
    private async RefreshIdentities() {
        const allIdentities = await this.api.Accounts(this.perferredProfileId)
        return this.scraperService.savePlatformIds(allIdentities)
    }
    private async RefreshFriends() {
        const friends = await this.api.Friends()
        return this.scraperService.saveFriendsList(friends)
    }
    private async RefreshProfileData() {
        if (this.account.callofduty_games.includes('mw')) {
            const profileData = await this.api.Profile(this.perferredProfileId, 'mp', 'mw')
            return this.scraperService.saveMwProfileData(profileData)
        }
    }
    private async RefreshMatchHistory() {
        if (this.account.callofduty_games.includes('cw')) {
            this.startTimes.cw = -1
            // const mpMatches = await this.api.MatchHistory(this.perferredProfileId, 'mp', 'cw')
        } else {
            this.startTimes.cw = -1
        }
        if (this.account.callofduty_games.includes('mw')) {
            if (this.startTimes.mw >= 0) {
                const mpMatches = await this.api.MatchHistory(this.perferredProfileId, 'mp', 'mw', this.startTimes.mw)
                this.startTimes.mw = await this.scraperService.saveMwMatchHistory(mpMatches, this.startTimes.mw)
            } else {
                console.log('[#] Stopped MW Match History search for startTime=-1')
            }
            if (this.startTimes.wz >= 0) {
                const wzMatches = await this.api.MatchHistory(this.perferredProfileId, 'wz', 'mw', this.startTimes.wz)
                this.startTimes.wz = await this.scraperService.saveWzMatchHistory(wzMatches, this.startTimes.wz)
            } else {
                console.log('[#] Stopped WZ Match History search for startTime=-1')
            }
        } else {
            this.startTimes.mw = -1
            this.startTimes.wz = -1
        }
    }
}

