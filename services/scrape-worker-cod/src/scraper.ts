import axios from 'axios'
import { Db, ObjectId } from 'mongodb'
import { delay } from '@stagg/util'
import { API, Schema, Normalize } from '@stagg/callofduty'
import { useClient } from './db'

export namespace ETL {
    export interface Log {
        _id?: ObjectId
        _account?: ObjectId
        created: Date
        options: Options
        updates: {
            matches: Log.Match[],
            profile: boolean,
        },
        operations: Log.Operation[],
    }
    export namespace Log {
        export interface Match {
            matchId: string
            report: boolean
            details?: boolean
            summary?: boolean
        }
        export interface Operation {
            [key:string]: any
        }
    }
    export interface Ledger {
        _id?: ObjectId
        _account: ObjectId
        selected: number
        bo4?: Ledger.Game
        mw?: Ledger.Game
    }
    export namespace Ledger {
        export interface Game {
            mp: Game.Type
            wz: Game.Type
        }
        export namespace Game {
            export interface Type {
                next: number
                newest: number
                oldest: number
                updated: number
                failures: number
            }
        }
    }
}

export interface Options {
    gameId: Schema.API.Game
    gameType: Schema.API.GameType
    retry: number // number of retry attempts
    start: number // starting timestamp
    offset: number // next "start" timestamp offset
    redundancy: boolean // false stops runner if encountering an existing match
    logger(...output:any): any // general information and error output
    delay: {
        success: 100, // wait this long after successful batch fetch
        failure: 500, // wait this long after failed batch fetch
    }
    include?: {
        events?: boolean // true will fetch match map events (extra req per match)
        details?: boolean // true will fetch match map events (extra req per match)
        summary?: boolean // true will fetch isolated summaries (extra req per match)
    }
}

export class Instance {
    private db: Db
    private API: API
    private log: ETL.Log
    private done: boolean
    private ledger: ETL.Ledger
    private account: Schema.DB.Account
    private options:Options = {
        gameId: 'mw',
        gameType: 'wz',
        retry: 3,
        start: 0,
        offset: 500,
        logger: console.log,
        redundancy: false,
        delay: {
            success: 100,
            failure: 500,
        },
        include: {
            events: false,
            details: false,
            summary: false,
        },
    }
    constructor(options?:Partial<Options>) {
        if (options) {
            this.options = {
                ...this.options,
                ...options,
            }
        }
    }
    public async ETL(accountId:string) {
        this.API = new API()
        this.account = { _id: new ObjectId(accountId) } as any
        await this.InitializeDB()
        await this.InitializeLog()
        await this.InitializeLedger()
        await this.InitializeAccount()
        if (!this.account.auth) {
            await this.ResolveAuth()
            this.API.Tokens(this.account.auth)
        } else {
            this.API.Tokens(this.account.auth)
            await this.IdentityETL()
        }
        if (this.ProfileRouteAvailable) {
            await this.ProfileETL()
        }
        await this.SyncLog()
        await this.SyncLedger()
        if (!this.Normalizer) {
            throw `unrecognized '${this.options.gameId}.${this.options.gameType}' normalization request`
        }
        let iteration = 0
        while(!this.done) {
            await this.MatchETL(iteration++)
            await this.SyncLog()
            await this.SyncLedger()
        }
    }
    private get ProfileRouteAvailable():boolean {
        switch(this.options.gameId) {
            case 'mw':
                return true
            default:
                return false
        }
    }
    private get MatchEventsRouteAvailable():boolean {
        if (this.options.gameId === 'mw' && this.options.gameType === 'mp') {
            return true
        }
        return false
    }
    private get Normalizer():{ [key:string]: any } {
        switch(this.options.gameId) {
            case 'mw':
                return Normalize.MW
            default:
                return null
        }
    }
    private get PreferredProfile():{ username: string, platform: Schema.API.Platform } {
        if (this.account.profiles.id) {
            return { username: this.account.profiles.id, platform: 'uno' }
        }
        if (this.account.profiles.battle) {
            return { username: this.account.profiles.battle, platform: 'battle' }
        }
        if (this.account.profiles.psn) {
            return { username: this.account.profiles.psn, platform: 'psn' }
        }
        if (this.account.profiles.xbl) {
            return { username: this.account.profiles.xbl, platform: 'xbl' }
        }
        if (this.account.profiles.steam) {
            return { username: this.account.profiles.steam, platform: 'steam' }
        }
        return { username: this.account.profiles.uno, platform: 'uno' }
    }
    private Done() {
        this.done = true
    }
    private async InitializeDB() {
        this.db = await useClient('callofduty')
    }
    private async InitializeLog() {
        this.log = {
            _account: this.account._id,
            created: new Date(),
            options: this.options,
            updates: {
                matches: [],
                profile: false,
            },
            operations: [],
        }
        await this.SyncLog()
    }
    private async SyncLog() {
        if (!this.log._id) {
            await this.db.collection('_ETL.log').insertOne(this.log)
        } else {
            await this.db.collection('_ETL.log').updateOne({ _id: this.log._id }, { $set: { ...this.log } })
        }
    }
    private async InitializeLedger() {
        this.ledger = await this.db.collection('_ETL.ledger').findOne({ _account: this.account._id })
        if (!this.ledger) {
            this.ledger = {
                _account: this.account._id,
            } as ETL.Ledger
        }
        this.ledger.selected = Date.now()
        if (!this.ledger[this.options.gameId]) {
            this.ledger[this.options.gameId] = {}
        }
        if (!this.ledger[this.options.gameId][this.options.gameType]) {
            this.ledger[this.options.gameId][this.options.gameType] = {
                next: 0,
                failures: 0,
                updated: Date.now()
            }
        }
        await this.SyncLedger()
    }
    private async SyncLedger() {
        if (!this.ledger._id) {
            await this.db.collection('_ETL.ledger').insertOne(this.ledger)
        } else {
            await this.db.collection('_ETL.ledger').updateOne({ _id: this.ledger._id }, { $set: { ...this.ledger } })
        }
    }
    private async InitializeAccount() {
        this.account = await this.db.collection('accounts').findOne({ _id: this.account._id })
        this.log.operations.push({ 'initialize-account': this.account._id })
    }
    private async ResolveAuth() {
        const [randomAcctWithAuth] = await this.db.collection('accounts').aggregate([
            { $match: { auth: { $exists: true } } },
            { $sample: { size: 1 } }
        ]).toArray()
        this.account.auth = randomAcctWithAuth.auth
        this.log.operations.push({ 'resolve-auth': this.account.auth })
    }
    // IdentityETL will only be called if this account has their own auth
    private async IdentityETL() {
        // Fetch identity (usually gives Battle.net ID)
        const { titleIdentities } = await this.API.Identity()
        const profiles:any = {}
        const games:Schema.API.Game[] = []
        for(const identity of titleIdentities) {
            profiles[identity.platform] = identity.username
            if (!games.includes(identity.title)) {
                games.push(identity.title)
            }
        }
        this.account.games = games
        if (!this.account.profiles) {
            this.account.profiles = {} as any
        }
        this.account.profiles = { ...this.account.profiles, ...profiles }
        // We cannot use uno ID for platform identities fetching
        const tmpUnoId = this.account.profiles.id
        delete this.account.profiles.id
        const { username, platform } = this.PreferredProfile
        // Now we can safely add back uno ID
        this.account.profiles.id = tmpUnoId
        // Fetch all other profiles given the singular Identity
        const platformProfiles = await this.API.Platforms(username, platform)
        for(const platform in platformProfiles) {
            profiles[platform] = platformProfiles[platform].username
        }
        // Save all profiles and games
        await this.db.collection('accounts').updateOne({ _id: this.account._id }, { $set: { games, profiles: this.account.profiles } })
        this.log.operations.push({ 'sync-identity': { games, profiles } })
    }
    private async ProfileETL() {
        if (!this.Normalizer.Profile) {
            throw `profile normalization missing for callofduty.${this.options.gameId}.${this.options.gameType}`
        }
        const { username, platform } = this.PreferredProfile
        const profile = await this.API.Profile(username, platform, this.options.gameType, this.options.gameId)
        const collection = `${this.options.gameId}.${this.options.gameType}.profiles`
        const normalizedProfile = this.Normalizer.Profile(profile, this.account)
        await this.db.collection(collection).deleteOne({ _account: this.account._id })
        await this.db.collection(collection).insertOne({
            _account: this.account._id,
            updated: new Date(),
            ...normalizedProfile,
        })
        this.log.operations.push({ 'sync-profile': { username, platform } })
    }
    private async MatchETL(iteration?:number) {
        try {
            await this.MatchBatchETL(iteration)
        } catch(e) {
            this.options.logger(`[!] Failure:`, e)
            this.ledger[this.options.gameId][this.options.gameType].failures++
            if (this.ledger[this.options.gameId][this.options.gameType].failures > this.options.retry) {
                this.options.logger('    Retry attempts exceeded, exiting...')
                this.Done()
            }
        }
    }
    private async MatchBatchETL(iteration?:number) {
        const { gameId, gameType, start } = this.options
        const timestamp = !iteration ? start : this.ledger[gameId][gameType].next
        const tmpUnoId = this.account.profiles.id
        delete this.account.profiles.id
        const { username, platform } = this.PreferredProfile
        const { matches } = await this.API.MatchList(username, platform, gameType, gameId, timestamp)
        this.account.profiles.id = tmpUnoId
        if (!matches?.length) {
            throw 'API returned empty matches...'
        }
        const matchMap:any = {}
        const matchIds:string[] = []
        const matchEndTimes:number[] = []
        const matchStartTimes:number[] = []
        for(const match of matches) {
            matchIds.push(match.matchID)
            matchMap[match.matchID] = match
            matchEndTimes.push(match.utcEndSeconds)
            matchStartTimes.push(match.utcStartSeconds)
        }
        const foundRecords = await this.db.collection(`${gameId}.${gameType}.match.records`)
            .find({ _account: this.account._id, matchId: { $in: matchIds } }, { matchId: 1 } as any).toArray()
        const foundRecordMatchIds = foundRecords.map(r => r.matchId)
        for(const matchId of matchIds.filter(mid => !foundRecordMatchIds.includes(mid))) {
            await this.MatchRecordETL(matchMap[matchId])
        }
        if (this.options.include?.details) {
            const foundDetails = await this.db.collection(`${gameId}.${gameType}.match.details`)
                .find({ matchId: { $in: matchIds } }, { matchId: 1 } as any).toArray()
            const foundDetailsMatchIds = foundDetails.map(d => d.matchId)
            for(const matchId of matchIds.filter(mid => !foundDetailsMatchIds.includes(mid))) {
                await this.MatchDetailsETL(matchMap[matchId])
            }
        }
        if (this.options.include?.events && this.MatchEventsRouteAvailable) {
            const foundEvents = await this.db.collection(`${gameId}.${gameType}.match.events`)
                .find({ matchId: { $in: matchIds } }, { matchId: 1 } as any).toArray()
            const foundEventsMatchIds = foundEvents.map(e => e.matchId)
            for(const matchId of matchIds.filter(mid => !foundEventsMatchIds.includes(mid))) {
                await this.MatchEventsETL(matchMap[matchId])
            }
        }
        if (this.options.include?.summary) {
            const foundSummaries = await this.db.collection(`${gameId}.${gameType}.match.records`).find({
                    _account: this.account._id,
                    matchId: { $in: matchIds },
                    'stats.avgLifeTime': { $exists: true },
                }, { matchId: 1 } as any).toArray()
            const foundSummariesMatchIds = foundSummaries.map(s => s.matchId)
            for(const matchId of matchIds.filter(mid => !foundSummariesMatchIds.includes(mid))) {
                await this.MatchSummaryETL(matchMap[matchId])
            }
        }
        if (foundRecords.length && !this.options.redundancy) {
            this.Done()
        }
        // API returns in batches of 20, if less than 20 it's the last batch of matches
        if (matchIds.length < 20) {
            this.Done()
        }
        // Update ledger as necessary
        const [newest] = matchEndTimes.sort((a,b) => b-a)
        const [oldest] = matchStartTimes.sort((a,b) => a-b)
        const [minEndTime] = matchEndTimes.sort((a,b) => a-b)
        this.ledger[gameId][gameType].next = (minEndTime - this.options.offset) * 1000
        this.ledger[gameId][gameType].updated = (new Date()).getTime()
        if (!this.ledger[gameId][gameType].newest || this.ledger[gameId][gameType].newest < newest) {
            this.ledger[gameId][gameType].newest = newest
        }
        if (!this.ledger[gameId][gameType].oldest || this.ledger[gameId][gameType].oldest > oldest) {
            this.ledger[gameId][gameType].oldest = oldest
        }
        this.log.operations.push({ 'sync-matches': { matchIds } })
    }
    private async RecordUnoID(unoId:string) {
        this.account.profiles.id = unoId
        this.options.logger(`[+] Recorded new UnoID ${unoId}`)
        await this.db.collection('accounts').updateOne({ _id: this.account._id }, { $set: { 'profiles.id': unoId } })
    }
    private async MatchRecordETL(match:Schema.API.MW.Match) {
        if (!this.account.profiles.id) {
            await this.RecordUnoID(match.player.uno)
        }
        const normalizedMatch = this.Normalizer.Match.Record(match)
        const collection = `${this.options.gameId}.${this.options.gameType}.match.records`
        await this.db.collection(collection).insertOne({ _account: this.account._id, ...normalizedMatch })
    }
    private async MatchEventsETL(match:Schema.API.MW.Match) {
        this.options.logger(`[>] Requesting match events for ${match.matchID}`)
        // No normalization for these yet, not sure it's really necessary...
        const collection = `${this.options.gameId}.${this.options.gameType}.match.events`
        const events = await this.API.MatchEvents(match.matchID, this.options.gameId)
        await this.db.collection(collection).insertOne(events)
        this.options.logger('    Saved match events for', match.matchID)
    }
    private async MatchDetailsETL(match:Schema.API.MW.Match) {
        this.options.logger(`[>] Requesting match details for ${match.matchID}`)
        const collection = `${this.options.gameId}.${this.options.gameType}.match.details`
        const details = await this.API.MatchDetails(match.matchID, this.options.gameType, this.options.gameId)
        const normalizedDetails = this.Normalizer.Match.Details(details)
        if (normalizedDetails) {
            await this.db.collection(collection).insertOne(normalizedDetails)
            this.options.logger('    Saved match details for', match.matchID)
        } else {
            console.log(`    Details normalizer missing for ${this.options.gameId}.${this.options.gameType}`)
        }
    }
    private async MatchSummaryETL(match:Schema.API.MW.Match) {
        this.options.logger(`[>] Requesting isolated match summary for ${match.matchID}`)
        const { summary } = await this.API.MatchSummary(match, this.options.gameId)
        if (summary) {
            const collection = `${this.options.gameId}.${this.options.gameType}.match.records`
            await this.db.collection(collection).updateOne({}, { $set: { 'stats.avgLifeTime': summary.all.avgLifeTime } })
            this.options.logger(`    Set avgLifeTime: ${summary.all.avgLifeTime}`)
        }
    }
}
