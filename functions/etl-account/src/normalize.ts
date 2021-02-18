import * as DB from '@stagg/db'
import { Friend, MW } from '@callofduty/types'
import { Profile } from '@callofduty/types/lib/mw'

export const normalizeUnoFriend = (account_id:string, friend:Friend):DB.CallOfDuty.Friend.Entity => {
    return {
        account_id,
        combined_id: `${account_id}.${friend.accountId}`,
        friendship_platform: 'uno',
        friend_uno_id: friend.accountId,
        friend_uno_username: friend.username,
        friend_online_status: friend.status.online,
        friend_current_game: friend.status.currentTitleId,
    }
}
export const normalizeConsoleFriend = (account_id:string, console:'xbl'|'psn', friend:Friend.Console):DB.CallOfDuty.Friend.Entity => {
    return {
        account_id,
        combined_id: `${account_id}.${friend.identities?.uno?.accountId}`,
        friendship_platform: console,
        friend_uno_id: friend.identities?.uno?.accountId,
        friend_uno_username: friend.identities?.uno?.username,
        friend_console_username: friend.username,
        friend_online_status: friend.status.online,
        friend_console_avatar_url: friend.avatarUrlLargeSsl,
    }
}

export const normalizeMwProfile = (account_id:string, profileRes:MW.Profile):DB.CallOfDuty.MW.Profile.Entity => {
    return {
        account_id,
        stat_level: profileRes.level,
        stat_level_xp_gained: profileRes.levelXpGained,
        stat_level_xp_remainder: profileRes.levelXpRemainder,
        stat_prestige: profileRes.prestige,
        stat_current_win_streak: profileRes.lifetime.all.properties.currentWinStreak,
        stat_lifetime_xp: profileRes.totalXp,
        stat_lifetime_score: profileRes.lifetime.all.properties.score,
        stat_lifetime_wins: profileRes.lifetime.all.properties.wins,
        stat_lifetime_draws: profileRes.lifetime.all.properties.ties,
        stat_lifetime_games: profileRes.lifetime.all.properties.gamesPlayed,
        stat_lifetime_kills: profileRes.lifetime.all.properties.kills,
        stat_lifetime_deaths: profileRes.lifetime.all.properties.deaths,
        stat_lifetime_assists: profileRes.lifetime.all.properties.assists,
        stat_lifetime_suicides: profileRes.lifetime.all.properties.suicides,
        stat_lifetime_headshots: profileRes.lifetime.all.properties.headshots,
        stat_lifetime_shots_hit: profileRes.lifetime.all.properties.hits,
        stat_lifetime_shots_missed: profileRes.lifetime.all.properties.totalShots - profileRes.lifetime.all.properties.hits,
        stat_lifetime_time_played: profileRes.lifetime.all.properties.timePlayedTotal,
        stat_lifetime_highest_win_streak: profileRes.lifetime.all.properties.recordLongestWinStreak,
        stat_lifetime_highest_kill_streak: profileRes.lifetime.all.properties.bestKillStreak,
        stat_lifetime_highest_kdr_match: profileRes.lifetime.all.properties.bestKD,
        stat_lifetime_highest_xp_match: profileRes.lifetime.all.properties.recordXpInAMatch,
        stat_lifetime_highest_spm_match: profileRes.lifetime.all.properties.bestSPM,
        stat_lifetime_highest_score_match: profileRes.lifetime.all.properties.bestScore,
        stat_lifetime_highest_kills_match: profileRes.lifetime.all.properties.bestKills,
        stat_lifetime_highest_deaths_match: profileRes.lifetime.all.properties.recordDeathsInAMatch,
        stat_lifetime_highest_assists_match: profileRes.lifetime.all.properties.bestAssists,
    }
}

export const normalizeMwMatch = (account_id:string, match:MW.Match.MP):DB.CallOfDuty.MW.Match.Entity => {
    let stat_team_placement = 0
    if (match.result === 'win') {
        stat_team_placement = 1
    }
    if (match.result === 'loss') {
        stat_team_placement = 2
    }
    return {
        account_id,
        combined_id: `${account_id}.${match.matchID}`,
        match_id: match.matchID,
        mode_id: match.mode,
        map_id: match.map,
        start_time: match.utcStartSeconds,
        end_time: match.utcEndSeconds,
        score_axis: match.team2Score || 0,
        score_allies: match.team1Score || 0,
        team_id: match.player.team,
        quit_early: match.isPresentAtEnd,
        stat_score: match.playerStats.score || 0,
        stat_time_played: match.playerStats.timePlayed || 0,
        stat_team_placement,
        stat_damage_done: match.playerStats.damageDone || 0,
        stat_damage_taken: match.playerStats.damageTaken || 0,
        stat_kills: match.playerStats.kills || 0,
        stat_deaths: match.playerStats.deaths || 0,
        stat_suicides: match.playerStats.suicides || 0,
        stat_assists: match.playerStats.assists || 0,
        stat_executions: match.playerStats.executions || 0,
        stat_headshots: match.playerStats.headshots || 0,
        stat_wall_bangs: match.playerStats.wallBangs || 0,
        stat_longest_streak: match.playerStats.longestStreak || 0,
        stat_distance_traveled: match.playerStats.distanceTraveled || 0,
        stat_percent_time_moving: match.playerStats.percentTimeMoving || 0,
        stat_avg_speed: match.playerStats.averageSpeedDuringMatch || 0,
        stat_xp_score: match.playerStats.scoreXp || 0,
        stat_xp_match: match.playerStats.matchXp || 0,
        stat_xp_bonus: match.playerStats.bonusXp || 0,
        stat_xp_medal: match.playerStats.medalXp || 0,
        stat_xp_misc: match.playerStats.miscXp || 0,
        stat_xp_challenge: match.playerStats.challengeXp || 0,
        stat_xp_total: match.playerStats.totalXp || 0,
    }
}

export const normalizeWzMatch = (account_id:string, match:MW.Match.WZ):DB.CallOfDuty.WZ.Match.Entity => {
    // Count downs
    const downs:number[] = []
    const downKeys = Object.keys(match.playerStats).filter(key => key.includes('objectiveBrDownEnemyCircle'))
    for (const key of downKeys) {
        const circleIndex = Number(key.replace('objectiveBrDownEnemyCircle', ''))
        downs[circleIndex] = match.playerStats[key] || 0
    }
    for(let i = 0; i < downs.length; i++) {
        if (!downs[i]) {
            downs[i] = 0
        }
    }
    return {
        account_id,
        stat_downs: downs,
        combined_id: `${account_id}.${match.matchID}`,
        match_id: match.matchID,
        mode_id: match.mode,
        map_id: match.map,
        start_time: match.utcStartSeconds,
        end_time: match.utcEndSeconds,
        team_id: match.player.team,
        stat_score: match.playerStats.score || 0,
        stat_time_played: match.playerStats.timePlayed || 0,
        stat_team_placement: match.playerStats.teamPlacement || 0,
        stat_damage_done: match.playerStats.damageDone || 0,
        stat_damage_taken: match.playerStats.damageTaken || 0,
        stat_kills: match.playerStats.kills || 0,
        stat_deaths: match.playerStats.deaths || 0,
        stat_executions: match.playerStats.executions || 0,
        stat_headshots: match.playerStats.headshots || 0,
        stat_longest_streak: match.playerStats.longestStreak || 0,
        stat_distance_traveled: match.playerStats.distanceTraveled || 0,
        stat_percent_time_moving: match.playerStats.percentTimeMoving || 0,
        stat_xp_score: match.playerStats.scoreXp || 0,
        stat_xp_match: match.playerStats.matchXp || 0,
        stat_xp_bonus: match.playerStats.bonusXp || 0,
        stat_xp_medal: match.playerStats.medalXp || 0,
        stat_xp_misc: match.playerStats.miscXp || 0,
        stat_xp_challenge: match.playerStats.challengeXp || 0,
        stat_xp_total: match.playerStats.totalXp || 0,
        stat_team_survival_time: match.playerStats.teamSurvivalTime || 0,
        stat_team_wipes: match.playerStats.objectiveTeamWiped || 0,
        stat_revives: match.playerStats.objectiveReviver || 0,
        stat_contracts: match.playerStats.objectiveBrMissionPickupTablet || 0,
        stat_loot_crates: match.playerStats.objectiveBrCacheOpen || 0,
        stat_buy_stations: match.playerStats.objectiveBrKioskBuy || 0,
        stat_gulag_kills: match.playerStats.gulagKills || 0,
        stat_gulag_deaths: match.playerStats.gulagDeaths || 0,
        stat_cluster_kills: match.playerStats.objectiveMedalScoreSsKillTomaStrike || 0,
        stat_airstrike_kills: match.playerStats.objectiveMedalScoreKillSsRadarDrone || 0,
        stat_equipment_destroyed: match.playerStats.objectiveDestroyedEquipment || 0,
        stat_trophy_defense: match.playerStats.objectiveTrophyDefense || 0,
        stat_munition_shares: match.playerStats.objectiveMunitionsBoxTeammateUsed || 0,
        stat_missile_redirects: match.playerStats.objectiveManualFlareMissileRedirect || 0,
    }
}

export const normalizeMwProfileWeapons = (account_id:string, profile:MW.Profile):DB.CallOfDuty.MW.Profile.Weapon.Entity[] => {
    const results:DB.CallOfDuty.MW.Profile.Weapon.Entity[] = []
    for(const category in profile.lifetime.itemData) {
        if (['lethals', 'tacticals'].includes(category)) {
            continue // normalize equipment separately
        }
        for(const wid in profile.lifetime.itemData[category]) {
            const weapon_id = <MW.Weapon.Name>wid
            const {
                hits,
                shots,
                kills,
                deaths,
                headshots,
            } = profile.lifetime.itemData[category][weapon_id].properties
            results.push({
                combined_id: `${account_id}.${weapon_id}`,
                account_id,
                weapon_id,
                stat_kills: kills || 0,
                stat_deaths: deaths || 0,
                stat_headshots: headshots || 0,
                stat_shots_hit: hits || 0,
                stat_shots_missed: shots - hits || 0,
            })
        }
    }
    return results
}

export const normalizeMwProfileEquipment = (account_id:string, profile:MW.Profile):DB.CallOfDuty.MW.Profile.Equipment.Entity[] => {
    const results:DB.CallOfDuty.MW.Profile.Equipment.Entity[] = []
    for(const category in profile.lifetime.itemData) {
        if (!['lethals', 'tacticals'].includes(category)) {
            continue // normalize weapons separately
        }
        for(const equipment_id in profile.lifetime.itemData[category]) {
            const stats = profile.lifetime.itemData[category][equipment_id].properties
            results.push({
                combined_id: `${account_id}.${equipment_id}`,
                account_id,
                equipment_id,
                equipment_type: stats.extraStat1 === undefined ? 'lethal' : 'tactical',
                stat_hits: stats.kills || stats.extraStat1 || 0,
                stat_uses: stats.uses || 0,
            })
        }
    }
    return results
}

export const normalizeMwProfileModes = (account_id:string, profile:MW.Profile):DB.CallOfDuty.MW.Profile.Mode.Entity[] => {
    const results:DB.CallOfDuty.MW.Profile.Mode.Entity[] = []
    for(const mid in profile.lifetime.mode) {
        if (mid.match(/^br/i)) {
            continue
        }
        const mode_id = <MW.Mode.MP>mid
        const mode = profile.lifetime.mode[mode_id].properties
        results.push({
            combined_id: `${account_id}.${mode_id}`,
            account_id,
            mode_id,
            stat_score: mode?.score || 0,
            stat_kills: mode?.kills || 0,
            stat_deaths: mode?.deaths || 0,
            stat_time_played: mode?.timePlayed || 0,
            stat_damage_done: mode?.damageDone || mode?.damage || 0,
            stat_objective_time: mode?.objTime || 0,
            stat_objective_defend: mode?.defends || mode?.confirms || mode?.plants || 0,
            stat_objective_capture: mode?.captures || mode?.denies || mode?.defuses || 0,
        })
    }
    return results
}

export const normalizeWzProfileModes = (account_id:string, profile:MW.Profile):DB.CallOfDuty.WZ.Profile.Mode.Entity[] => {
    const results:DB.CallOfDuty.WZ.Profile.Mode.Entity[] = []
    for(const mid in profile.lifetime.mode) {
        if (!mid.match(/^br/i)) {
            continue
        }
        const mode_id = <MW.Mode.WZ>mid
        const mode = <Profile.Mode.WZ>profile.lifetime.mode[mode_id].properties
        results.push({
            combined_id: `${account_id}.${mode_id}`,
            account_id,
            mode_id,
            stat_wins: mode.wins || 0,
            stat_games: mode.gamesPlayed,
            stat_top5: mode.topFive || 0,
            stat_top10: mode.topTen || 0,
            stat_top25: mode.topTwentyFive || 0,
            stat_downs: mode.downs || 0,
            stat_contracts: mode.contracts || 0,
            stat_revives: mode.revives || 0,
            stat_cash: mode.cash || 0,
            stat_score: mode?.score || 0,
            stat_kills: mode?.kills || 0,
            stat_deaths: mode?.deaths || 0,
            stat_time_played: mode?.timePlayed || 0,
        })
    }
    return results
}

export const normalizeWzLoadout = (account_id:string, match_id:string, index:number, loadout:MW.Loadout):DB.CallOfDuty.WZ.Loadout.Entity => ({
    combined_id: `${account_id}.${match_id}.${index}`,
    account_id,
    match_id,
    equip_lethal_id: loadout.lethal.name,
    equip_tactical_id: loadout.tactical.name,
    perk_slot_1: loadout.perks[0]?.name,
    perk_slot_2: loadout.perks[1]?.name,
    perk_slot_3: loadout.perks[2]?.name,
    perk_extra_1: loadout.extraPerks[0]?.name,
    perk_extra_2: loadout.extraPerks[1]?.name,
    perk_extra_3: loadout.extraPerks[2]?.name,
    primary_weapon_id: loadout.primaryWeapon.name,
    primary_weapon_var: Number(loadout.primaryWeapon.variant || -1),
    primary_weapon_att_1: loadout.primaryWeapon.attachments[0]?.name,
    primary_weapon_att_2: loadout.primaryWeapon.attachments[1]?.name,
    primary_weapon_att_3: loadout.primaryWeapon.attachments[2]?.name,
    primary_weapon_att_4: loadout.primaryWeapon.attachments[3]?.name,
    primary_weapon_att_5: loadout.primaryWeapon.attachments[4]?.name,
    secondary_weapon_id: loadout.secondaryWeapon.name,
    secondary_weapon_var: Number(loadout.secondaryWeapon.variant || -1),
    secondary_weapon_att_1: loadout.secondaryWeapon.attachments[0]?.name,
    secondary_weapon_att_2: loadout.secondaryWeapon.attachments[1]?.name,
    secondary_weapon_att_3: loadout.secondaryWeapon.attachments[2]?.name,
    secondary_weapon_att_4: loadout.secondaryWeapon.attachments[3]?.name,
    secondary_weapon_att_5: loadout.secondaryWeapon.attachments[4]?.name,

})
