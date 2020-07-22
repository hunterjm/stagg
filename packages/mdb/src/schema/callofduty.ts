import * as Mongo from 'mongodb'
import * as API from '@stagg/api'

export interface Player extends Player.Scaffold {
    _id: Mongo.ObjectID
    games: API.Schema.CallOfDuty.Game[]
    profiles: Player.Profiles
    scrape: {
        updated: number
        failures: number
        timestamp: number
        rechecked?: number // last time initialization recheck was ran
    }
    discord?: {
        id: string
        shortcuts?: { [key:string]: string }
    }
    prev: {
        auth: []
        email: []
        discord: []
    }
    initFailure?: boolean // true if titleIdentities was blank on init
}
export namespace Player {
    export interface Auth {
        sso: string
        xsrf: string
        atkn: string
    }
    export interface Profiles {
        id?: string // uno id
        uno: string
        battle?: string
        xbl?: string
        psn?: string
        steam?: string
    }
    export interface Scaffold {
        auth: Auth
        origin: 'self' | 'kgp' | 'friend' | 'enemy' | 'random'
        email?: string // only for origin:self
        profiles?: Player.Profiles // only for origin:!self, otherwise populated by scraper
    }
}
export interface Loadout {
    primary: Loadout.Weapon
    secondary: Loadout.Weapon
    lethal: string
    tactical: string
    perks: string[]
    killstreaks: string[]
}
export namespace Loadout {
    export interface Weapon {
        weapon: string
        variant: number
        attachments: string[]
    }
}

// Performances are player-specific
export namespace WZ {
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
        loadouts: Loadout[]
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
}

// Performances are player-specific
export namespace MW {
    export interface Performance {
        mapId: string
        modeId: string
        matchId: string
        endTime: number
        startTime: number
        playlistName: string
        result: string
        winningTeam: string
        gameBattle: boolean
        team1Score: number
        team2Score: number
        isPresentAtEnd: boolean
        arena: boolean
        privateMatch: boolean
        player: {
            _id: Mongo.ObjectId
            team: string
            username: string
            clantag: string
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
            accuracy: number
            shotsLanded: number
            shotsMissed: number
            executions: number 
            headshots: number
            longestStreak: number
            timePlayed: number
            weapons: Stats.Weapon[]
            killstreaks: Stats.Killstreak[]
            xp: Stats.XP
            objective: Stats.Objectives
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
                weaponId: string
                hits: number
                kills: number
                headshots: number
                loadoutIndex: number
                shots: number
                startingWeaponXp: number
                deaths: number
                xpEarned: number
            }
            export interface Killstreak {
                killstreakId: string
                count: number
                // xp?
                // kills?
            }
            export interface Objectives {
                objectiveCaptureKill: number
                objectiveObjProgDefend: number
                objectiveGainedGunRank: number
                objectiveKillConfirmed: number
                objectiveKillDenied: number
                objectiveKcFriendlyPickup: number
                objectiveMedalModeKcOwnTagsScore: number
                objectiveDestroyedEquipment: number
                objectiveMedalScoreSsKillPrecisionAirstrike: number
                objectiveMedalScoreSsKillCruisePredator: number
                objectiveMedalScoreKillSsSentryGun: number
                objectiveMedalScoreKillSsChopperGunner: number
                objectiveMedalModeXAssaultScore: number
                objectiveMedalModeXDefendScore: number
                objectiveMedalModeDomSecureScore: number
                objectiveMedalModeDomSecureBScore: number
                objectiveMedalModeDomSecureNeutralScore: number
                objectiveMedalModeDomSecureAssistScore: number
            }
        }
    }
}

// Matches are generic game records
export interface Match {
    mapId: string
    modeId: string
    matchId: string
    endTime: number
    startTime: number
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
        loadouts: Loadout[]
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
