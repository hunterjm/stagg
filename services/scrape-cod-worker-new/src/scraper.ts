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
        _account: ObjectId
        timestamps: {
            selected: number
            bo4?: Ledger.Game
            mw?: Ledger.Game
        }
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
    summary: boolean // true will fetch isolated summaries (extra req per match)
    redundancy: boolean // false stops runner if encountering an existing match
    logger(...output:any): any // general information and error output
    delay: {
        success: 100, // wait this long after successful batch fetch
        failure: 500, // wait this long after failed batch fetch
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
        summary: false,
        logger: console.log,
        redundancy: false,
        delay: {
            success: 100,
            failure: 500,
        }
    }
    constructor(options?:Partial<Options>) {
        if (options) {
            this.options = {
                ...this.options,
                ...options,
            }
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
    public async ETL(accountId:string) {
        this.account = { _id: new ObjectId(accountId) } as any
        await this.InitializeDB()
        await this.InitializeLog()
        await this.InitializeAccount()
        if (!this.account.auth) {
            await this.ResolveAuth()
        } else {
            await this.IdentityETL()
        }
        this.API = new API(this.account.auth)
        if (this.ProfileRouteAvailable) {
            await this.ProfileETL()
        }
        while(!this.done) {
            await this.MatchETL()
        }
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
        await this.db.collection('_ETL.log').insertOne(this.log)
    }
    private async InitializeAccount() {
        this.account = await this.db.collection('accounts').findOne({ _id: this.account._id })
    }
    private async ResolveAuth() {
        const [randomAcctWithAuth] = await this.db.collection('accounts').aggregate([
            { $match: { auth: { $exists: true } } },
            { $sample: { size: 1 } }
        ]).toArray()
        this.account.auth = randomAcctWithAuth.auth
    }
    // IdentityETL will only be called if this account has their own auth
    private async IdentityETL() {
        const { titleIdentities } = await this.API.Identity()
        const profileUpdates:any = {}
        const games:Schema.API.Game[] = []
        for(const identity of titleIdentities) {
            profileUpdates[`profiles.${identity.platform}`] = identity.username
            if (!games.includes(identity.title)) {
                games.push(identity.title)
            }
        }
        await this.db.collection('accounts').updateOne({ _id: this.account._id }, { $set: { games, ...profileUpdates } })
    }
    private async ProfileETL() {

    }
    private async MatchETL() {
        try {
            await this.MatchBatchETL()
        } catch(e) {
            this.options.logger(`[!] Scraper API Failure:`, e)
        }
    }
    private async MatchBatchETL() {
        const { gameId, gameType, start } = this.options
        const { username, platform } = this.PreferredProfile
        const { matches } = await this.API.Matches(username, platform, gameType, gameId, start)
        const matchMap:any = {}
        const matchIds:string[] = []
        for(const match of matches) {
            matchIds.push(match.matchID)
            matchMap[match.matchID] = match
        }
        const foundRecords = await this.db.collection(`${gameId}.${gameType}.match.records`)
            .find({ _account: this.account._id, matchId: { $in: matchIds } }, { matchId: 1 } as any).toArray()
        const foundRecordMatchIds = foundRecords.map(r => r.matchId)
        for(const matchId of matchIds.filter(mid => !foundRecordMatchIds.includes(mid))) {
            await this.MatchRecordETL(matchMap[matchId])
        }
        const foundDetails = await this.db.collection(`${gameId}.${gameType}.match.details`)
            .find({ matchId: { $in: matchIds } }, { matchId: 1 } as any).toArray()
        const foundDetailsMatchIds = foundDetails.map(d => d.matchId)
        for(const matchId of matchIds.filter(mid => !foundDetailsMatchIds.includes(mid))) {
            await this.MatchDetailsETL(matchMap[matchId])
        }
        if (this.MatchEventsRouteAvailable) {
            const foundEvents = await this.db.collection(`${gameId}.${gameType}.match.events`)
                .find({ matchId: { $in: matchIds } }, { matchId: 1 } as any).toArray()
            const foundEventsMatchIds = foundEvents.map(e => e.matchId)
            for(const matchId of matchIds.filter(mid => !foundEventsMatchIds.includes(mid))) {
                await this.MatchEventsETL(matchMap[matchId])
            }
        }
        if (this.options.summary) {
            const foundSummaries = await this.db.collection(`${gameId}.${gameType}.match.summaries`)
                .find({ _account: this.account._id, matchId: { $in: matchIds } }, { matchId: 1 } as any).toArray()
            const foundSummariesMatchIds = foundSummaries.map(s => s.matchId)
            for(const matchId of matchIds.filter(mid => !foundSummariesMatchIds.includes(mid))) {
                await this.MatchSummaryETL(matchMap[matchId])
            }
        }
    }
    private async MatchEventsETL(match:Schema.API.MW.Match) {
        // No normalization for these yet...
        const events = await this.API.MatchEvents(match.matchID, this.options.gameId)
        this.options.logger('[>] Got match events:', events)
    }
    private async MatchDetailsETL(match:Schema.API.MW.Match) {
        const details = await this.API.MatchDetails(match.matchID, this.options.gameType, this.options.gameId)
        this.options.logger('[>] Got match details:', details)
    }
    private async MatchSummaryETL(match:Schema.API.MW.Match) {
        const { summary } = await this.API.MatchSummary(match, this.options.gameId)
        this.options.logger('[>] Got match summary:', summary)
    }
    private async MatchRecordETL(match:Schema.API.MW.Match) {
        if (!this.account.profiles.id) {
            await this.RecordUnoID(match.player.uno)
        }
        // const normalizedMatch = Normalize
    }
    private async RecordUnoID(unoId:string) {
        this.account.profiles.id = unoId
        await this.db.collection('accounts').updateOne({ _id: this.account._id }, { $set: { 'profiles.id': unoId } })
    }
}
