import { Db } from 'mongodb'
import * as API from '@stagg/api'
import * as Mongo from '@stagg/mdb'
import { delay } from '@stagg/util'
import * as Normalize from './normalize'

export namespace Options {
    export interface Matches {
        game: API.Schema.CallOfDuty.Game
        mode: API.Schema.CallOfDuty.Mode
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
}
export namespace Runners {
    export class Matches {
        private db: Db
        private complete: boolean
        private API: API.CallOfDuty
        private minEndTime:number
        public player: Mongo.Schema.CallOfDuty.Account
        private options:Options.Matches = {
            game: 'mw',
            mode: 'wz',
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
        constructor(player:Mongo.Schema.CallOfDuty.Account, options?:Partial<Options.Matches>) {
            this.player = player
            if (options) {
                this.options = {...this.options, ...options}
            }
            this.SetupScraperRecord()
            this.API = new API.CallOfDuty(this.player.auth)
            this.player.scrape[this.options.game][this.options.mode].timestamp = this.options.start
        }
        public async ETL(cfg:Mongo.Config) {
            Mongo.config(cfg)
            this.db = await Mongo.client('callofduty')
            this.options.logger(`[>] COD: Scraping ${this.Description}`)
            while (!this.complete) {
                try {
                    await this.DownloadBatch()
                    await this.UpdatePlayer(true)
                    await delay(this.options.delay.success)
                } catch(e) {
                    this.options.logger(`[!] Scraper API Failure:`, e)
                    if (this.player.scrape[this.options.game][this.options.mode].failures >= this.options.retry) {
                        this.complete = true
                    } else {
                        this.player.scrape[this.options.game][this.options.mode].failures++
                        await this.UpdatePlayer()
                        await delay(this.options.delay.failure)
                    }
                }
            }
            return this
        }
        private async UpdatePlayer(success?:boolean) {
            if (success) {
                this.player.scrape[this.options.game][this.options.mode].failures = 0
                this.player.scrape[this.options.game][this.options.mode].timestamp = this.NextTimestamp
            }
            this.player.scrape.updated = Math.round(new Date().getTime() / 1000)
            this.player.scrape[this.options.game][this.options.mode].updated = this.player.scrape.updated
            await this.db.collection('accounts').updateOne({ _id: this.player._id }, { $set: { scrape: this.player.scrape } })
        }
        private async DownloadBatch() {
            const { game, mode } = this.options
            const { username, platform } = this.PreferredProfile
            const res:any = await this.API.Matches(username, platform, mode, game, this.player.scrape[game][mode].timestamp)
            if (!res.matches) {
                throw `No matches returned for ${this.Description}`
            }
            // Set player "uno" id if not already in db (only in MW responses)
            if (!this.player.profiles.id && this.options.game === 'mw') {
                const [firstMatch] = res.matches.filter((m: API.Schema.CallOfDuty.MW.WZ.Match) => m.player.uno)
                this.player.profiles.id = firstMatch.player.uno
                await this.db.collection('accounts').updateOne({ _id: this.player._id }, { $set: { 'profiles.id': this.player.profiles.id } })
            }
            if (!this.Normalizer) {
                // No normalizer setup yet, skip
                this.options.logger(`[?] Normalize.${game.toUpperCase()}.${mode.toUpperCase()} not found, only raw matches will be recorded...`)
            }
            for (const rawMatch of res.matches) {
                const didWrite = await this.RecordMatch(rawMatch)
                if (!didWrite && !this.options.redundancy) {
                    // if redundancy isn't enabled we're now finished
                    this.complete = true
                    break
                }
            }
            if (res.matches.length < 20) {
                this.complete = true
            }
            return this
        }
        private async RecordMatch(m:API.Schema.CallOfDuty.Match):Promise<boolean> {
            let newVersionAvailable = false // not implemented yet...
            const rawMatchFound = await this.db.collection(this.Collection.Raw).findOne({ matchID: m.matchID, 'player._id': this.player._id })
            if (!this.minEndTime || this.minEndTime > m.utcEndSeconds) {
                this.minEndTime = m.utcEndSeconds
            }
            if (!rawMatchFound) {
                const mAsAny = m as any
                const rawMatchDoc:any = {
                    ...mAsAny,
                    player: mAsAny.player ? { ...mAsAny.player, _id: this.player._id } : { _id: this.player._id }
                }
                await this.db.collection(this.Collection.Raw).insertOne(rawMatchDoc)
            } else {
                // check if we now have team data prop and didn't before
                if (!rawMatchFound[this.TeamDataProp] && m[this.TeamDataProp]) {
                    newVersionAvailable = true
                    await this.db.collection(this.Collection.Raw).updateOne({ matchId: m.matchID }, { $set: { [this.TeamDataProp]: m[this.TeamDataProp] } })
                }
                return false
            }
            if (!this.Normalizer) {
                // No normalizer setup yet, skip
                return
            }
            const matchFound = await this.db.collection(this.Collection.Matches).findOne({ matchId: m.matchID })
            if (!matchFound && m[this.TeamDataProp]) {
                this.options.logger(`    Saving generic record for match ${m.matchID}`)
                const normalizedMatch = this.Normalizer.Match && this.Normalizer.Match(m)
                if (normalizedMatch) {
                    await this.db.collection(this.Collection.Matches).insertOne(normalizedMatch)
                }
            }
            const performanceFound = await this.db.collection(this.Collection.Performances).findOne({ 'player._id': this.player._id, matchId: m.matchID })
            if (!performanceFound) {
                this.options.logger(`    Saving performance for match ${m.matchID}`)
                const normalizedPerformance = this.Normalizer.Performance && this.Normalizer.Performance(m, this.player)
                if (normalizedPerformance) {
                    await this.db.collection(this.Collection.Performances).insertOne(normalizedPerformance)
                }
            }
            return true
        }
        private async SetupScraperRecord() {
            const defaultMode = { [this.options.mode]: { updated: 0, failures: 0, timestamp: 0 } }
            const defaultGame = { [this.options.game]: defaultMode }
            if (!this.player.scrape) {
                this.player.scrape = { ...defaultGame }
                return this
            }
            if (!this.player.scrape[this.options.game]) {
                this.player.scrape[this.options.game] = { ...defaultMode }
                return this
            }
            if (!this.player.scrape[this.options.game][this.options.mode]) {
                this.player.scrape[this.options.game] = {
                    ...defaultMode,
                    ...this.player.scrape[this.options.game],
                }
            }
            return this
        }
        private get Collection() {
            return {
                Raw: `_raw.${this.options.game}.${this.options.mode}.matches`,
                Matches: `${this.options.game}.${this.options.mode}.matches`,
                Performances: `${this.options.game}.${this.options.mode}.performances`,
            }
        }
        private get TeamDataProp() {
            return this.options.mode === 'wz' ? 'rankedTeams' : 'allPlayers'
        }
        private get Normalizer() {
            const cGame = this.options.game.toUpperCase()
            const cMode = this.options.mode.toUpperCase()
            return Normalize[cGame] && Normalize[cGame][cMode]
        }
        private get NextTimestamp() {
            if (!this.minEndTime) {
                throw 'No min time set'
            }
            const offsetTimestamp = this.minEndTime - this.options.offset
            return offsetTimestamp * 1000 // convert seconds to microseconds
        }
        private get Description() {
            const { game, mode } = this.options
            const { username, platform } = this.PreferredProfile
            return `${game} > ${mode} > ${platform} > ${username} @ ${this.player.scrape[game][mode].timestamp}`
        }
        private get PreferredProfile():{username:string, platform:API.Schema.CallOfDuty.Platform} {
            // prefer battle, bo4 seemingly won't work with uno
            if (this.player.profiles.battle) return { platform: 'battle', username: this.player.profiles.battle }
            if (this.player.profiles.uno)    return { platform: 'uno', username: this.player.profiles.uno }
            if (this.player.profiles.xbl)    return { platform: 'xbl', username: this.player.profiles.xbl }
            if (this.player.profiles.psn)    return { platform: 'psn', username: this.player.profiles.psn }
            throw new Error(`No valid profiles found for player ${JSON.stringify(this.player)}`)
        }
    }
}
