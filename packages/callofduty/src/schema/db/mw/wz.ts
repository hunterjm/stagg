import * as Mongo from 'mongodb'
import * as MW from '.'

export namespace Match {
    // Matches are generic game records
    export interface Details {
        mapId: string
        modeId: string
        matchId: string
        endTime: number
        startTime: number
        teams: {
            name: string
            time: number
            placement: number
            players: Details.Player[]
        }[]
    }
    export namespace Details {
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
    // Records are player specific
    export interface Record {
        _account?: Mongo.ObjectId
        mapId: string
        modeId: string
        matchId: string
        endTime: number
        startTime: number
        player: {
            team: string
            username: string
            clantag: string
        }
        stats: Record.Stats
        loadouts: MW.Loadout[]
    }
    export namespace Record {
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
}