import * as Schema from '..'
export interface Matches {
    summary: Summary
    matches: Match[]
}
export interface Summary {

}
export interface Match extends Schema.Match {
    utcStartSeconds: number
    utcEndSeconds: number
    map: string
    mode: string
    matchID: string
    draw: boolean
    playerCount: number
    teamCount: number
    player: Schema.Player
    playerStats: Match.PlayerStats
    rankedTeams: Match.Team[]
}
export namespace Match {
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
export interface Profile {
    level: number
}
