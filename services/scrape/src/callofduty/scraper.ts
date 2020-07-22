import { Db } from 'mongodb'
import * as API from '@stagg/api'
import * as Mongo from '@stagg/mdb'
import { delay } from '@stagg/util'

const selectProfile = (player: Mongo.Schema.CallOfDuty.Player): { platform: API.Schema.CallOfDuty.Platform, username: string } => {
    if (player.profiles.uno) return { platform: 'uno', username: player.profiles.uno }
    if (player.profiles.xbl) return { platform: 'xbl', username: player.profiles.xbl }
    if (player.profiles.psn) return { platform: 'psn', username: player.profiles.psn }
    if (player.profiles.battle) return { platform: 'battle', username: player.profiles.battle }
    throw new Error(`No valid profiles found for player ${JSON.stringify(player)}`)
}
const nextTimestamp = (matches: API.Schema.CallOfDuty.Res.Match[], offset: number): number => {
    const timestamps = matches.map(m => m.utcEndSeconds)
    const edgeTimestamp = Math.min(...timestamps)
    const offsetTimestamp = edgeTimestamp - offset
    return offsetTimestamp * 1000 // convert seconds to microseconds
}

export class CallOfDuty {
    public player: Mongo.Schema.CallOfDuty.Player
    private complete: boolean
    private db: Db
    private readonly API: API.CallOfDuty
    private readonly options: CallOfDuty.Options = {
        game: 'wz',
        start: 0,
        retry: 1,
        offset: 500,
        redundancy: false,
        logger: console.log,
        callback: () => { },
        delay: {
            success: 100,
            failure: 500,
        }
    }
    constructor(player: Mongo.Schema.CallOfDuty.Player, options?: Partial<CallOfDuty.Options>) {
        this.player = player
        if (!this.player.scrape) {
            this.player.scrape = { updated: 0, failures: 0, timestamp: 0 }
        }
        this.player.scrape.timestamp = options.start
        this.options = { ...this.options, ...options }
        this.API = new API.CallOfDuty(this.player.auth)
    }

    async Run(mongoCfg: Mongo.Config) {
        Mongo.config(mongoCfg)
        this.db = await Mongo.client()
        while (!this.complete) {
            await this.Fetch()
        }
        this.player.scrape.updated = Math.round(new Date().getTime() / 1000)
        await this.db.collection('players').updateOne({ _id: this.player._id }, { $set: { scrape: this.player.scrape } })
    }

    async Fetch() {
        const { platform, username } = selectProfile(this.player)
        this.options.logger(`[>] COD: Scraping ${platform}/${username} @ ${this.player.scrape.timestamp}`)
        try {
            const getMatches = this.options.game == 'mw' ? this.MW : this.WZ
            const res = await getMatches.Matches(username, platform)
            const matches = res.matches as API.Schema.CallOfDuty.Res.Match[]
            const matchIds = matches.filter(m => m).map(m => m.matchID)
            this.player.scrape.failures = 0
            this.player.scrape.timestamp = nextTimestamp(matches, this.options.offset)
            // Call Of Duty API responds in batches of 20 so if less than 20 we've reached the end
            if (matchIds.length < 20) {
                this.complete = true
            }
            await delay(this.options.delay.success)
        } catch (e) {
            this.options.logger(`[!] Scraper API Failure:`, e)
            if (this.player.scrape.failures >= this.options.retry) {
                this.complete = true
            } else {
                this.player.scrape.failures++
                await delay(this.options.delay.failure)
                await this.Fetch()
            }
        }
    }
  
    private get WZ() {
        return {
            Matches: async (username: string, platform: API.Schema.CallOfDuty.Platform): Promise<API.Schema.CallOfDuty.Res.Warzone.Matches> => {
                const res = await this.API.WZ.Matches(username, platform, this.player.scrape.timestamp)
                this.options.callback(res)
                // Set player "uno" id if not already in db
                if (!this.player.profiles.id) {
                    const [firstMatch] = res.matches.filter((m: API.Schema.CallOfDuty.Res.Warzone.Match) => m.player.uno)
                    this.player.profiles.id = firstMatch.player.uno
                    await this.db.collection('players').updateOne({ _id: this.player._id }, { $set: { uno: this.player.profiles.id } })
                }
                for (const rawMatch of res.matches) {
                    const matchFound = await this.db.collection('matches.wz').findOne({ matchId: rawMatch.matchID })
                    if (!matchFound && rawMatch.rankedTeams) {
                        this.options.logger(`    Saving generic record for match ${rawMatch.matchID}`)
                        const normalizedMatch = Normalize.Warzone.Match(rawMatch) as Mongo.Schema.CallOfDuty.Match
                        await this.db.collection('matches.wz').insertOne(normalizedMatch)
                    }
                    const performanceFound = await this.db.collection('performances.wz').findOne({ 'player._id': this.player._id, matchId: rawMatch.matchID })
                    if (!performanceFound) {
                        this.options.logger(`    Saving performance for match ${rawMatch.matchID}`)
                        const normalizedPerformance = Normalize.Warzone.Performance(rawMatch, this.player)
                        await this.db.collection('performances.wz').insertOne(normalizedPerformance)
                    }
                    if (performanceFound && !this.options.redundancy) {
                        this.complete = true
                    }
                }
                return res
            }
        }
    }

    private get MW() {
        return {
            Matches: async (username: string, platform: API.Schema.CallOfDuty.Platform): Promise<API.Schema.CallOfDuty.Res.ModernWarfare.Matches> => {
                const res = await this.API.MW.Matches(username, platform, this.player.scrape.timestamp)
                this.options.callback(res)
                // Set player "uno" id if not already in db
                if (!this.player.profiles.id) {
                    const [firstMatch] = res.matches.filter((m: API.Schema.CallOfDuty.Res.ModernWarfare.Match) => m.player.uno)
                    this.player.profiles.id = firstMatch.player.uno
                    await this.db.collection('players').updateOne({ _id: this.player._id }, { $set: { uno: this.player.profiles.id } })
                }
                for (const rawMatch of res.matches) {
                    const performanceFound = await this.db.collection('performances.mw').findOne({ 'player._id': this.player._id, matchId: rawMatch.matchID })
                    if (!performanceFound) {
                        this.options.logger(`    Saving performance for match ${rawMatch.matchID}`)
                        const normalizedPerformance = Normalize.MordernWarfare.Performance(rawMatch, this.player)
                        await this.db.collection('performances.mw').insertOne(normalizedPerformance)
                    }
                }
                return res
            }
        }
    }
}

namespace CallOfDuty {
    export type Game = 'mw' | 'wz'
    export interface Options {
        game: Game         // informs the scraper which game to scrape data for
        start: number      // for "start"/"end" params in API
        retry: number      // number of allowed failures/retries before exiting
        offset: number      // number of ms to subtract from subsequent "end" params
        logger: Function    // Log output function
        callback: Function    // Callback to receive API responses
        redundancy: boolean     // false will exit after encountering an existing match
        delay: {
            success: number      // number of ms to wait after successful API transaction
            failure: number      // number of ms to wait after an API failure before retrying
        }
    }
}

export namespace Normalize {
    const getStat = (stats: any, stat: string) => stats && !isNaN(Number(stats[stat])) ? Number(stats[stat]) : 0
    const getOptionalStat = (stats: any, stat: string) => stats && !isNaN(Number(stats[stat])) ? Number(stats[stat]) : null
    export const Loadout = (loadout: API.Schema.CallOfDuty.Res.Loadout): Mongo.Schema.CallOfDuty.Loadout => ({
        primary: {
            weapon: loadout.primaryWeapon.name,
            variant: Number(loadout.primaryWeapon.variant),
            attachments: loadout.primaryWeapon.attachments.filter(a => a.name !== 'none').map(a => a.name),
        },
        secondary: {
            weapon: loadout.secondaryWeapon.name,
            variant: Number(loadout.secondaryWeapon.variant),
            attachments: loadout.secondaryWeapon.attachments.filter(a => a.name !== 'none').map(a => a.name),
        },
        lethal: loadout.lethal.name,
        tactical: loadout.tactical.name,
        perks: loadout.perks.filter(p => p.name !== 'specialty_null').map(perk => perk.name),
        killstreaks: loadout.killstreaks.filter(ks => ks.name !== 'none').map(ks => ks.name),
    })
    export namespace Warzone {
        export const Match = (match: API.Schema.CallOfDuty.Res.Warzone.Match): Mongo.Schema.CallOfDuty.Match => ({
            matchId: match.matchID,
            modeId: match.mode,
            mapId: match.map,
            endTime: match.utcEndSeconds,
            startTime: match.utcStartSeconds,
            teams: Teams(match)
        })
        export const Teams = (match: API.Schema.CallOfDuty.Res.Warzone.Match) => !match.rankedTeams ? [] :
            match.rankedTeams.map((team: API.Schema.CallOfDuty.Res.Warzone.Match.Team) => ({
                name: team.name,
                placement: team.placement,
                time: team.time,
                players: team.players.map((player: API.Schema.CallOfDuty.Res.Warzone.Match.Team.Player) => ({
                    uno: player.uno,
                    username: player.username.replace(/^(\[[^\]]+\])?(.*)$/, '$2'),
                    clantag: player.username.replace(/^(\[[^\]]+\])?(.*)$/, '$1') || null,
                    platform: player.platform,
                    rank: player.rank,
                    loadouts: player.loadouts?.map((loadout: API.Schema.CallOfDuty.Res.Loadout) => Normalize.Loadout(loadout)) || [],
                    stats: {
                        rank: getStat(player.playerStats, 'rank'),
                        score: getStat(player.playerStats, 'score'),
                        kills: getStat(player.playerStats, 'kills'),
                        deaths: getStat(player.playerStats, 'deaths'),
                        damageDone: getStat(player.playerStats, 'damageDone'),
                        damageTaken: getStat(player.playerStats, 'damageTaken'),
                        wallBangs: getStat(player.playerStats, 'wallBangs'),
                        headshots: getStat(player.playerStats, 'headshots'),
                        executions: getStat(player.playerStats, 'executions'),
                        assists: getStat(player.playerStats, 'assists'),
                        nearmisses: getStat(player.playerStats, 'nearmisses'),
                        longestStreak: getStat(player.playerStats, 'longestStreak'),
                        timePlayed: getStat(player.playerStats, 'timePlayed'),
                        distanceTraveled: getStat(player.playerStats, 'distanceTraveled'),
                        percentTimeMoving: getStat(player.playerStats, 'percentTimeMoving'),
                    }
                })),
            }))
        export const Performance = (match: API.Schema.CallOfDuty.Res.Warzone.Match, player: Partial<Mongo.Schema.CallOfDuty.Player>): Mongo.Schema.CallOfDuty.WZ.Performance => {
            // Count downs
            let downs = []
            const downKeys = Object.keys(match.playerStats).filter(key => key.includes('objectiveBrDownEnemyCircle'))
            for (const key of downKeys) {
                const circleIndex = Number(key.replace('objectiveBrDownEnemyCircle', ''))
                downs[circleIndex] = getStat(match.playerStats, key)
            }
            return {
                mapId: match.map,
                modeId: match.mode,
                matchId: match.matchID,
                endTime: match.utcEndSeconds,
                startTime: match.utcStartSeconds,
                player: {
                    _id: player._id,
                    team: match.player.team,
                    username: match.player.username,
                    clantag: match.player.clantag,
                },
                stats: {
                    rank: getStat(match.playerStats, 'rank'),
                    score: getStat(match.playerStats, 'score'),
                    kills: getStat(match.playerStats, 'kills'),
                    deaths: getStat(match.playerStats, 'deaths'),
                    downs,
                    gulagKills: getStat(match.playerStats, 'gulagKills'),
                    gulagDeaths: getStat(match.playerStats, 'gulagDeaths'),
                    eliminations: getStat(match.playerStats, 'objectiveLastStandKill'),
                    damageDone: getStat(match.playerStats, 'damageDone'),
                    damageTaken: getStat(match.playerStats, 'damageTaken'),
                    teamWipes: getStat(match.playerStats, 'objectiveTeamWiped'),
                    revives: getStat(match.playerStats, 'objectiveReviver'),
                    contracts: getStat(match.playerStats, 'objectiveBrMissionPickupTablet'),
                    lootCrates: getStat(match.playerStats, 'objectiveBrCacheOpen'),
                    buyStations: getStat(match.playerStats, 'objectiveBrKioskBuy'),
                    assists: getStat(match.playerStats, 'assists'),
                    executions: getStat(match.playerStats, 'executions'),
                    headshots: getStat(match.playerStats, 'headshots'),
                    wallBangs: getStat(match.playerStats, 'wallBangs'),
                    nearMisses: getStat(match.playerStats, 'nearmisses'),
                    clusterKills: getStat(match.playerStats, 'objectiveMedalScoreSsKillTomaStrike'),
                    airstrikeKills: getStat(match.playerStats, 'objectiveMedalScoreKillSsRadarDrone'),
                    longestStreak: getStat(match.playerStats, 'longestStreak'),
                    trophyDefense: getStat(match.playerStats, 'objectiveTrophyDefense'),
                    munitionShares: getStat(match.playerStats, 'objectiveMunitionsBoxTeammateUsed'),
                    missileRedirects: getStat(match.playerStats, 'objectiveManualFlareMissileRedirect'),
                    equipmentDestroyed: getStat(match.playerStats, 'objectiveDestroyedEquipment'),
                    percentTimeMoving: getStat(match.playerStats, 'percentTimeMoving'),
                    distanceTraveled: getStat(match.playerStats, 'distanceTraveled'),
                    teamSurvivalTime: getStat(match.playerStats, 'teamSurvivalTime'),
                    teamPlacement: getStat(match.playerStats, 'teamPlacement'),
                    timePlayed: getStat(match.playerStats, 'timePlayed'),
                    xp: {
                        score: getStat(match.playerStats, 'scoreXp'),
                        match: getStat(match.playerStats, 'matchXp'),
                        bonus: getStat(match.playerStats, 'bonusXp'),
                        medal: getStat(match.playerStats, 'medalXp'),
                        misc: getStat(match.playerStats, 'miscXp'),
                        challenge: getStat(match.playerStats, 'challengeXp'),
                        total: getStat(match.playerStats, 'totalXp'),
                    }
                },
                loadouts: match.player.loadout.map(loadout => Normalize.Loadout(loadout)),
            }
        }
    }
    export namespace MordernWarfare {
        export const Performance = (match: API.Schema.CallOfDuty.Res.ModernWarfare.Match, player: Partial<Mongo.Schema.CallOfDuty.Player>): Mongo.Schema.CallOfDuty.MW.Performance => {
            return {
                mapId: match.map,
                modeId: match.mode,
                matchId: match.matchID,
                endTime: match.utcEndSeconds,
                startTime: match.utcStartSeconds,
                playlistName: match.playlistName,
                result: match.result,
                winningTeam: match.winningTeam,
                gameBattle: match.gameBattle,
                team1Score: match.team1Score,
                team2Score: match.team2Score,
                isPresentAtEnd: match.isPresentAtEnd,
                arena: match.arena,
                privateMatch: match.privateMatch,
                player: {
                    _id: player._id,
                    team: match.player.team,
                    username: match.player.username,
                    clantag: match.player.clantag,
                },
                stats: {
                    rank: getStat(match.playerStats, 'rank'),
                    score: getStat(match.playerStats, 'score'),
                    kills: getStat(match.playerStats, 'kills'),
                    deaths: getStat(match.playerStats, 'deaths'),
                    assists: getStat(match.playerStats, 'assists'),
                    accuracy: getStat(match.playerStats, 'accuracy'),
                    shotsLanded: getStat(match.playerStats, 'shotsLanded'),
                    shotsMissed: getStat(match.playerStats, 'shotsMissed'),
                    executions: getStat(match.playerStats, 'executions'),
                    headshots: getStat(match.playerStats, 'headshots'),
                    longestStreak: getStat(match.playerStats, 'longestStreak'),
                    timePlayed: getStat(match.playerStats, 'timePlayed'),
                    weapons: Normalize.MordernWarfare.Weapons(match),
                    killstreaks: Normalize.MordernWarfare.Killstreaks(match.player),
                    xp: {
                        score: getStat(match.playerStats, 'scoreXp'),
                        match: getStat(match.playerStats, 'matchXp'),
                        medal: getStat(match.playerStats, 'medalXp'),
                        misc: getStat(match.playerStats, 'miscXp'),
                        total: getStat(match.playerStats, 'totalXp'),
                    },
                    objective: {
                        objectiveCaptureKill: getStat(match.playerStats, 'objectiveCaptureKill'),
                        objectiveObjProgDefend: getStat(match.playerStats, 'objectiveObjProgDefend'),
                        objectiveGainedGunRank: getStat(match.playerStats, 'objectiveGainedGunRank'),
                        objectiveKillConfirmed: getStat(match.playerStats, 'objectiveKillConfirmed'),
                        objectiveKillDenied: getStat(match.playerStats, 'objectiveKillDenied'),
                        objectiveKcFriendlyPickup: getStat(match.playerStats, 'objectiveKcFriendlyPickup'),
                        objectiveMedalModeKcOwnTagsScore: getStat(match.playerStats, 'objectiveMedalModeKcOwnTagsScore'),
                        objectiveDestroyedEquipment: getStat(match.playerStats, 'objectiveDestroyedEquipment'),
                        objectiveMedalScoreSsKillPrecisionAirstrike: getStat(match.playerStats, 'objectiveMedalScoreSsKillPrecisionAirstrike'),
                        objectiveMedalScoreSsKillCruisePredator: getStat(match.playerStats, 'objectiveMedalScoreSsKillCruisePredator'),
                        objectiveMedalScoreKillSsSentryGun: getStat(match.playerStats, 'objectiveMedalScoreKillSsSentryGun'),
                        objectiveMedalScoreKillSsChopperGunner: getStat(match.playerStats, 'objectiveMedalScoreKillSsChopperGunner'),
                        objectiveMedalModeXAssaultScore: getStat(match.playerStats, 'objectiveMedalModeXAssaultScore'),
                        objectiveMedalModeXDefendScore: getStat(match.playerStats, 'objectiveMedalModeXDefendScore'),
                        objectiveMedalModeDomSecureScore: getStat(match.playerStats, 'objectiveMedalModeDomSecureScore'),
                        objectiveMedalModeDomSecureBScore: getStat(match.playerStats, 'objectiveMedalModeDomSecureBScore'),
                        objectiveMedalModeDomSecureNeutralScore: getStat(match.playerStats, 'objectiveMedalModeDomSecureNeutralScore'),
                        objectiveMedalModeDomSecureAssistScore: getStat(match.playerStats, 'objectiveMedalModeDomSecureAssistScore'),
                    }
                },
                loadouts: match.player.loadout.map(loadout => Normalize.Loadout(loadout)),
            }
        }
        export const Killstreaks = (player: API.Schema.CallOfDuty.Res.ModernWarfare.Match.Player): Mongo.Schema.CallOfDuty.MW.Performance.Stats.Killstreak[] => {
            var killstreakStats = []
            for (const killstreak in player.killstreakUsage) {
                killstreakStats.push({
                    killstreakId: killstreak,
                    count: player.killstreakUsage[killstreak],
                })
            }
            return killstreakStats
        }
        export const Weapons = (match: API.Schema.CallOfDuty.Res.ModernWarfare.Match): Mongo.Schema.CallOfDuty.MW.Performance.Stats.Weapon[] => {
            var weapons = []
            for (const weapon in match.weaponStats) {
                weapons.push({
                    weaponId: weapon,
                    hits: match.weaponStats[weapon].hits,
                    kills: match.weaponStats[weapon].kills,
                    headshots: match.weaponStats[weapon].headshots,
                    loadoutIndex: match.weaponStats[weapon].loadoutIndex,
                    shots: match.weaponStats[weapon].shots,
                    startingWeaponXp: match.weaponStats[weapon].startingWeaponXp,
                    deaths: match.weaponStats[weapon].deaths,
                    xpEarned: match.weaponStats[weapon].xpEarned,
                })
            }
            return weapons
        }
    }
}
