import * as Schema from '.'

export type Map = 'mp_don3' | 'mp_donetsk' | 'mp_donetsk2'
export interface Summary {
    kills: number
    objectiveTeamWiped: number
    objectiveLastStandKill: number
    wallBangs: number
    avgLifeTime: number
    score: number
    headshots: number
    assists: number
    killsPerGame: number
    scorePerMinute: number
    distanceTraveled: number
    deaths: number
    objectiveDestroyedEquipment: number
    objectiveMedalScoreSsKillPrecisionAirstrike: number
    objectiveBrDownEnemyCircle3: number
    objectiveBrDownEnemyCircle2: number
    kdRatio: number
    objectiveBrDownEnemyCircle1: number
    objectiveBrMissionPickupTablet: number
    objectiveReviver: number
    objectiveBrKioskBuy: number
    gulagDeaths: number
    timePlayed: number
    headshotPercentage: number
    executions: number
    matchesPlayed: number
    gulagKills: number
    nearmisses: number
    objectiveBrCacheOpen: number
    damageDone: number
    damageTaken: number
}
export interface Match extends Schema.Match.Common {
    gameType: 'wz'
    map: Map
    mode: Match.Mode
    draw: boolean
    playerCount: number
    teamCount: number
    player: Schema.Player
    playerStats: Match.PlayerStats
    rankedTeams: Match.Team[]
}
export namespace Match {
    export type Mode = 
        // warzone plunder
        'br_dmz_38' | 'br_dmz_76' | 'br_dmz_85' | 'br_dmz_104' | 'br_dmz_plndtrios' | 'br_dmz_plunquad' |
        'br_dmz_plnbld' | 
        // warzone br
        'br_25' | 'br_71' | 'br_74' | 'br_77' | 'br_86' | 'br_87' | 'br_88' | 'br_89' | 
        'br_brsolo' | 'br_brduos' | 'br_brtrios' | 'br_brquads' | 'br_br_real' | 'br_brthquad' |
        'brtdm_rmbl' | 'br_mini_miniroyale' | 'br_jugg_brtriojugr' | 'br_jugg_brquadjugr' | 'br_brbbsolo' |
        'br_brtriostim_name2' | 'br_brduostim_name2' | 'br_brbbquad' | 'br_truckwar_trwarsquads'
    export interface Team {
        name: string
        placement: number
        time: number
        plunder: null
        players: Match.Team.Player[]
    }
    export namespace Team {
        export interface Player {
            uno: string
            username: string
            clantag: string
            platform: string
            team: string
            rank: number
            result: null
            playerStats: Player.Stats
            loadouts: Schema.Loadout[]
        }
        export namespace Player {
            export interface Stats {
                rank: number
                score: number
                kills: number
                deaths: number
                kdRatio: number
                damageDone: number
                damageTaken: number
                timePlayed: number
                wallBangs: number
                headshots: number
                executions: number
                assists: number
                nearmisses: number
                longestStreak: number
                scorePerMinute: number
                distanceTraveled: number
                percentTimeMoving: number
            }
        }
    }
    export interface PlayerStats extends Schema.PlayerStats {
        bonusXp: number
        challengeXp: number
        teamPlacement: number
        teamSurvivalTime: number
        gulagKills?: number
        gulagDeaths?: number
        objectiveReviver?: number
        objectiveTeamWiped?: number
        objectiveBrKioskBuy?: number
        objectiveBrCacheOpen?: number
        objectiveLastStandKill?: number
        objectiveTrophyDefense?: number
        objectiveDestroyedEquipment?: number
        objectiveBrDownEnemyCircle1?: number
        objectiveBrDownEnemyCircle2?: number
        objectiveBrDownEnemyCircle3?: number
        objectiveBrDownEnemyCircle4?: number
        objectiveBrDownEnemyCircle5?: number
        objectiveBrDownEnemyCircle6?: number
        objectiveBrDownEnemyCircle7?: number
        objectiveBrDownEnemyCircle8?: number
        objectiveBrMissionPickupTablet?: number
        objectiveMunitionsBoxTeammateUsed?: number
        objectiveManualFlareMissileRedirect?: number
        objectiveMedalScoreKillSsRadarDrone?: number
        objectiveMedalScoreSsKillTomaStrike?: number
    }
}
// Warzone Profile
export interface Profile extends Schema.Routes.Profile {

}

