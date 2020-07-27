import * as Mongo from 'mongodb'
import { Loadout } from '..'

export interface Performance {
    mapId: string
    modeId: string
    matchId: string
    endTime: number
    startTime: number
    quit: boolean
    playlist: string
    gameBattle: boolean
    arena: boolean
    privateMatch: boolean
    player: {
        _id: Mongo.ObjectId
        team: string
        username: string
        clantag: string
    }
    score: {
        axis: number
        allies: number
    }
    stats: Performance.Stats
    loadouts: Loadout[]
}
export namespace Performance {
    export interface Stats {
        rank: number
        score: number
        kills: number
        deaths: number
        assists: number
        executions: number 
        headshots: number
        longestStreak: number
        timePlayed: number
        teamPlacement: number // 0 is tie
        avgSpeed: number
        shots: {
            hit: number
            miss: number
        }
        weapons: { // [key:weaponId]: stats
            [key:string]: Stats.Weapon
        }
        killstreaks: { // [key:killstreakId]: Killstreak
            [key:string]: Stats.Killstreak
        }
        objectives: Stats.Objectives
        xp: Stats.XP
    }
    export namespace Stats {
        export interface XP {
            misc: number
            medal: number
            match: number
            score: number
            total: number
        }
        export interface Weapon {
            loadout: number
            kills: number
            deaths: number
            headshots: number
            shots: {
                hit: number
                miss: number
            }
            xp: {
                start: number
                earned: number
            }
        }
        export interface Killstreak {
            uses: number
            kills: number
            takedowns: number
        }
        export interface Objectives {
            // Flags, etc
            captureKill: number
            defenseKill: number
            defendScore: number
            assaultScore: number
            captureScore: number // dom cap
            captureScoreB: number // dom cap B flag
            captureAssistScore: number // dom cap assist
            captureNeutralScore: number // dom cap B flag
            // Kill Confirmed
            tagOwn: number
            tagDeny: number
            tagConfirm: number
            tagFriendly: number
            // Misc
            gainedGunRank: number
            equipmentDestroyed: number
        }
    }
}
