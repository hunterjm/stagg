import * as Mongo from 'mongodb'
import * as MW from '.'

// Matches are generic game records
export interface Match extends MW.Match {
    teams: {
        name: string
        time: number
        placement: number
        players: Match.Player[]
    }[]
}
export namespace Match {
    export interface Player {
        uno: string
        username: string
        clantag: string
        platform: string
        rank: number
        stats: Player.Stats
        loadouts: MW.Loadout[]
    }
    export namespace Player {
        export interface Stats {
            score: number
            kills: number
            deaths: number
            assists: number
            headshots: number
            executions: number
            damageDone: number
            damageTaken: number
            longestStreak: number
            timePlayed: number
            distanceTraveled: number
            percentTimeMoving: number
        }
    }
}
// Performances are player specific
export interface Performance {
    mapId: string
    modeId: string
    matchId: string
    endTime: number
    startTime: number
    player: {
        _id: Mongo.ObjectId
        team: string
        username: string
        clantag: string
    }
    stats: Performance.Stats
    loadouts: MW.Loadout[]
}
export namespace Performance {
    export interface Stats {
        rank: number
        score: number
        kills: number
        deaths: number
        downs: number[] // [circleIndex:circleDowns]
        gulagKills: number
        gulagDeaths: number
        eliminations: number
        damageDone: number
        damageTaken: number
        teamWipes: number
        revives: number
        contracts: number
        lootCrates: number
        buyStations: number
        assists: number
        executions: number
        headshots: number
        wallBangs: number
        nearMisses: number
        clusterKills: number
        airstrikeKills: number
        longestStreak: number
        trophyDefense: number
        munitionShares: number
        missileRedirects: number
        equipmentDestroyed: number
        percentTimeMoving: number
        distanceTraveled: number
        teamSurvivalTime: number
        teamPlacement: number
        timePlayed: number
        xp: Stats.XP
    }
    export namespace Stats {
        export interface XP {
            misc: number
            medal: number
            match: number
            score: number
            bonus: number
            challenge: number
            total: number
        }
    }
}
