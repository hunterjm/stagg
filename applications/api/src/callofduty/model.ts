import { MW } from '@callofduty/types'
import { CallOfDuty } from '@stagg/db'
import { Model } from '@stagg/api'

export const denormalizeMwProfile = (entity:CallOfDuty.MW.Profile.Entity):Partial<Model.MW.Profile> => ({
    updated: entity.updated_datetime,
    level: entity.stat_level,
    prestige: entity.stat_prestige,
    levelXpGained: entity.stat_level_xp_gained,
    levelXpRemainder: entity.stat_level_xp_remainder,
    currentWinStreak: entity.stat_current_win_streak,
    lifetime: {
        xp: entity.stat_lifetime_xp,
        wins: entity.stat_lifetime_wins,
        score: entity.stat_lifetime_score,
        draws: entity.stat_lifetime_draws,
        games: entity.stat_lifetime_games,
        kills: entity.stat_lifetime_kills,
        deaths: entity.stat_lifetime_deaths,
        assists: entity.stat_lifetime_assists,
        suicides: entity.stat_lifetime_suicides,
        headshots: entity.stat_lifetime_headshots,
        timePlayed: entity.stat_lifetime_time_played,
        shots: {
            hit: entity.stat_lifetime_shots_hit,
            miss: entity.stat_lifetime_shots_missed,
        }
    },
    record: {
        xp: entity.stat_lifetime_highest_xp_match,
        spm: entity.stat_lifetime_highest_spm_match,
        kdr: entity.stat_lifetime_highest_kdr_match,
        score: entity.stat_lifetime_highest_score_match,
        kills: entity.stat_lifetime_highest_kills_match,
        deaths: entity.stat_lifetime_highest_deaths_match,
        assists: entity.stat_lifetime_highest_assists_match,
        winStreak: entity.stat_lifetime_highest_win_streak,
        killStreak: entity.stat_lifetime_highest_kill_streak,
    }
})

export const denormalizeMwModes = (entities:CallOfDuty.MW.Profile.Mode.Entity[]):Record<MW.Mode.MP, Model.MW.Profile.Mode> => {
    const modeMap = <Record<MW.Mode.MP, Model.MW.Profile.Mode>>{}
    for(const entity of entities) {
        modeMap[entity.mode_id] = {
            modeId: entity.mode_id,
            score: entity.stat_score,
            kills: entity.stat_kills,
            deaths: entity.stat_deaths,
            timePlayed: entity.stat_time_played,
        }
    }
    return modeMap
}

export const denormalizeMwWeapons = (entities:CallOfDuty.MW.Profile.Weapon.Entity[]):Record<MW.Weapon.Name, Model.MW.Profile.Weapon> => {
    const weaponMap = <Record<MW.Weapon.Name, Model.MW.Profile.Weapon>>{}
    for(const entity of entities) {
        weaponMap[entity.weapon_id] = {
            weaponId: entity.weapon_id,
            kills: entity.stat_kills,
            deaths: entity.stat_deaths,
            headshots: entity.stat_headshots,
            shots: {
                hit: entity.stat_shots_hit,
                miss: entity.stat_shots_missed,
            }
        }
    }
    return weaponMap
}

export const denormalizeMwEquipment = (entities:CallOfDuty.MW.Profile.Equipment.Entity[]):Record<string, Model.MW.Profile.Equipment> => {
    const equipMap = <Record<string, Model.MW.Profile.Equipment>>{}
    for(const entity of entities) {
        equipMap[entity.equipment_id] = {
            equipmentId: entity.equipment_id,
            equipmentType: entity.equipment_type,
            uses: entity.stat_uses,
            [entity.equipment_type === 'tactical' ? 'hits' : 'kills']: entity.stat_hits
        }
    }
    return equipMap
}

export const denormalizeWzModes = (entities:CallOfDuty.WZ.Profile.Mode.Entity[]):Record<MW.Mode.WZ, Model.WZ.Profile.Mode> => {
    const modeMap = <Record<MW.Mode.WZ, Model.WZ.Profile.Mode>>{}
    for(const entity of entities) {
        modeMap[entity.mode_id] = {
            modeId: entity.mode_id,
            score: entity.stat_score,
            kills: entity.stat_kills,
            deaths: entity.stat_deaths,
            wins: entity.stat_wins,
            games: entity.stat_games,
            top5: entity.stat_top5,
            top10: entity.stat_top10,
            top25: entity.stat_top25,
            downs: entity.stat_downs,
            contracts: entity.stat_contracts,
            revives: entity.stat_revives,
            cash: entity.stat_cash,
            timePlayed: entity.stat_time_played,
        }
    }
    return modeMap
}
