import * as Schema from '.'
export type Map = 'mp_rust' | string
export interface Summary {

}
export interface Match extends Schema.Match.Common {
    gameType: 'mp'
    mode: Match.Mode
    map: Map
    result: Match.Result
    winningTeam: Match.Team
    gameBattle: boolean
    team1Score: number
    team2Score: number
    isPresentAtEnd: boolean
    allPlayers: {}
    arena: boolean
    player: Match.Player
    playerStats: Match.PlayerStats
    weaponStats: { [key: string]: Match.WeaponStats } // weaponId: { weaponStats }
}
export namespace Match {
    export type Team = 'allies' | 'axis'
    export type Result = 'win' | 'loss' | 'draw'
    export type Mode = 
        // multiplayer
        'dm' | 'tdef' | 'war' | 'dom' | 'conf' | 'koth' | 'hq' | 'dd' | 'sd' | 'cyber' | 'grind' |
        // hc_* appears in profile endpoint and *_hc appears in matches so mapping both
        'hc_dm' | 'dm_hc' | 'hc_dd' | 'dd_hc' | 'hc_hq' | 'hq_hc' | 'hc_sd' | 'sd_hc' | 'hc_dom' | 'dom_hc' |
        'hc_war' | 'war_hc' | 'hc_conf' | 'conf_hc' | 'hc_koth' | 'koth_hc' | 'hc_cyber' | 'cyber_hc' |
        // special modes
        'arm' | 'gun' | 'arena'
    export interface Player extends Schema.Player {
        nemesis: string
        mostKilled: string
        killstreakUsage: {
            radar_drone_overwatch?: number
            manual_turret?: number
            scrambler_drone_guard?: number
            uav?: number
            airdrop?: number
            toma_strike?: number
            cruise_predator?: number
            precision_airstrike?: number
            bradley?: number
            sentry_gun?: number
            pac_sentry?: number
            airdrop_multiple?: number
            hover_jet?: number
            white_phosphorus?: number
            chopper_gunner?: number
            chopper_support?: number
            gunship?: number
            directional_uav?: number
            juggernaut?: number
            nuke?: number
        }
    }
    export interface PlayerStats extends Schema.PlayerStats {
        suicides: number
        accuracy: number
        shotsLanded: number
        shotsMissed: number
        shotsFired: number
        bonusXp: number
        totalXp: number
        challengeXp: number
        averageSpeedDuringMatch: number
        objectiveCaptureKill?: number
        objectiveObjProgDefend?: number
        objectiveGainedGunRank?: number
        objectiveKillConfirmed?: number
        objectiveKillDenied?: number
        objectiveKcFriendlyPickup?: number
        objectiveMedalModeKcOwnTagsScore?: number
        objectiveDestroyedEquipment?: number
        objectiveMedalModeXAssaultScore?: number
        objectiveMedalModeXDefendScore?: number
        objectiveMedalModeDomSecureScore?: number
        objectiveMedalModeDomSecureBScore?: number
        objectiveMedalModeDomSecureNeutralScore?: number
        objectiveMedalModeDomSecureAssistScore?: number
        objectiveMedalScoreSsKillRadarDroneOverwatch?: number
        objectiveMedalScoreKillSsRadarDroneOverwatch?: number
        objectiveMedalScoreSsKillManualTurret?: number
        objectiveMedalScoreKillSsManualTurret?: number
        objectiveMedalScoreSsKillScramblerDroneGuard?: number
        objectiveMedalScoreKillSsScramblerDroneGuard?: number
        objectiveMedalScoreSsKillUav?: number
        objectiveMedalScoreKillSsUav?: number
        objectiveMedalScoreSsKillAirdrop?: number
        objectiveMedalScoreKillSsAirdrop?: number
        objectiveMedalScoreSsKillTomaStrike?: number
        objectiveMedalScoreKillSsTomaStrike?: number
        objectiveMedalScoreSsKillCruisePredator?: number
        objectiveMedalScoreKillSsCruisePredator?: number
        objectiveMedalScoreSsKillPrecisionAirstrike?: number
        objectiveMedalScoreKillSsPrecisionAirstrike?: number
        objectiveMedalScoreSsKillBradley?: number
        objectiveMedalScoreKillSsBradley?: number
        objectiveMedalScoreSsKillSentryGun?: number
        objectiveMedalScoreKillSsSentryGun?: number
        objectiveMedalScoreSsKillPacSentry?: number
        objectiveMedalScoreKillSsPacSentry?: number
        objectiveMedalScoreSsKillAirdropMultiple?: number
        objectiveMedalScoreKillSsAirdropMultiple?: number
        objectiveMedalScoreSsKillHoverJet?: number
        objectiveMedalScoreKillSsHoverJet?: number
        objectiveMedalScoreSsKillWhitePhosphorus?: number
        objectiveMedalScoreKillSsWhitePhosphorus?: number
        objectiveMedalScoreSsKillChopperGunner?: number
        objectiveMedalScoreKillSsChopperGunner?: number
        objectiveMedalScoreSsKillChopperSupport?: number
        objectiveMedalScoreKillSsChopperSupport?: number
        objectiveMedalScoreSsKillGunship?: number
        objectiveMedalScoreKillSsGunship?: number
        objectiveMedalScoreSsKillDirectionalUav?: number
        objectiveMedalScoreKillSsDirectionalUav?: number
        objectiveMedalScoreSsKillJuggernaut?: number
        objectiveMedalScoreKillSsJuggernaut?: number
        objectiveMedalScoreSsKillNuke?: number
        objectiveMedalScoreKillSsNuke?: number
    }
    export interface WeaponStats {
        hits: number
        kills: number
        headshots: number
        loadoutIndex: number
        shots: number
        startingWeaponXp: number
        deaths: number
        xpEarned: number
    }
}

