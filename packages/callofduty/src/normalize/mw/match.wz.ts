import { Schema } from '../..'
import { Stat, Loadout } from './match'

export const Details = (match: Schema.API.MW.Routes.MatchDetails):Schema.DB.MW.WZ.Match.Details => {
    const [first] = match.allPlayers
    return {
        matchId: first.matchID,
        modeId: first.mode,
        mapId: first.map,
        endTime: first.utcEndSeconds,
        startTime: first.utcStartSeconds,
        players: Players(match)
    }
}

export const Players = (match: Schema.API.MW.Routes.MatchDetails):Schema.DB.MW.WZ.Match.Details.Player[] => match.allPlayers.map((p:any) => {
    // Count downs
    let downs = []
    const downKeys = Object.keys(p.playerStats).filter(key => key.includes('objectiveBrDownEnemyCircle'))
    for (const key of downKeys) {
        const circleIndex = Number(key.replace('objectiveBrDownEnemyCircle', ''))
        downs[circleIndex] = Stat(p.playerStats, key)
    }
    return {
        id: p.player.uno,
        team: p.player.team,
        username: p.player.username,
        clantag: p.player.clantag,
        stats: {
            rank: Stat(p.playerStats, 'rank'),
            score: Stat(p.playerStats, 'score'),
            kills: Stat(p.playerStats, 'kills'),
            deaths: Stat(p.playerStats, 'deaths'),
            // downs,
            gulagKills: Stat(p.playerStats, 'gulagKills'),
            gulagDeaths: Stat(p.playerStats, 'gulagDeaths'),
            eliminations: Stat(p.playerStats, 'objectiveLastStandKill'),
            damageDone: Stat(p.playerStats, 'damageDone'),
            damageTaken: Stat(p.playerStats, 'damageTaken'),
            teamWipes: Stat(p.playerStats, 'objectiveTeamWiped'),
            revives: Stat(p.playerStats, 'objectiveReviver'),
            contracts: Stat(p.playerStats, 'objectiveBrMissionPickupTablet'),
            lootCrates: Stat(p.playerStats, 'objectiveBrCacheOpen'),
            buyStations: Stat(p.playerStats, 'objectiveBrKioskBuy'),
            assists: Stat(p.playerStats, 'assists'),
            executions: Stat(p.playerStats, 'executions'),
            headshots: Stat(p.playerStats, 'headshots'),
            wallBangs: Stat(p.playerStats, 'wallBangs'),
            nearMisses: Stat(p.playerStats, 'nearmisses'),
            clusterKills: Stat(p.playerStats, 'objectiveMedalScoreSsKillTomaStrike'),
            airstrikeKills: Stat(p.playerStats, 'objectiveMedalScoreKillSsRadarDrone'),
            longestStreak: Stat(p.playerStats, 'longestStreak'),
            trophyDefense: Stat(p.playerStats, 'objectiveTrophyDefense'),
            munitionShares: Stat(p.playerStats, 'objectiveMunitionsBoxTeammateUsed'),
            missileRedirects: Stat(p.playerStats, 'objectiveManualFlareMissileRedirect'),
            equipmentDestroyed: Stat(p.playerStats, 'objectiveDestroyedEquipment'),
            percentTimeMoving: Stat(p.playerStats, 'percentTimeMoving'),
            distanceTraveled: Stat(p.playerStats, 'distanceTraveled'),
            teamSurvivalTime: Stat(p.playerStats, 'teamSurvivalTime'),
            teamPlacement: Stat(p.playerStats, 'teamPlacement'),
            timePlayed: Stat(p.playerStats, 'timePlayed'),
            xp: {
                score: Stat(p.playerStats, 'scoreXp'),
                match: Stat(p.playerStats, 'matchXp'),
                bonus: Stat(p.playerStats, 'bonusXp'),
                medal: Stat(p.playerStats, 'medalXp'),
                misc: Stat(p.playerStats, 'miscXp'),
                challenge: Stat(p.playerStats, 'challengeXp'),
                total: Stat(p.playerStats, 'totalXp'),
            }
        },
        loadouts: p.player.loadout.map(loadout => Loadout(loadout)),
    } as any
})

export const Teams = (match: Schema.API.MW.WZ.Match) => !match.rankedTeams ? [] :
    match.rankedTeams.map((team: Schema.API.MW.WZ.Match.Team) => ({
        name: team.name,
        placement: team.placement,
        time: team.time,
        players: team.players.map((player: Schema.API.MW.WZ.Match.Team.Player) => ({
            uno: player.uno,
            username: player.username.replace(/^(\[[^\]]+\])?(.*)$/, '$2'),
            clantag: player.username.replace(/^(\[[^\]]+\])?(.*)$/, '$1') || null,
            rank: player.rank,
            loadouts: player.loadouts?.map((loadout: Schema.API.MW.Loadout) => Loadout(loadout)) || [],
            stats: {
                rank: Stat(player.playerStats, 'rank'),
                score: Stat(player.playerStats, 'score'),
                kills: Stat(player.playerStats, 'kills'),
                deaths: Stat(player.playerStats, 'deaths'),
                damageDone: Stat(player.playerStats, 'damageDone'),
                damageTaken: Stat(player.playerStats, 'damageTaken'),
                wallBangs: Stat(player.playerStats, 'wallBangs'),
                headshots: Stat(player.playerStats, 'headshots'),
                executions: Stat(player.playerStats, 'executions'),
                assists: Stat(player.playerStats, 'assists'),
                nearmisses: Stat(player.playerStats, 'nearmisses'),
                longestStreak: Stat(player.playerStats, 'longestStreak'),
                timePlayed: Stat(player.playerStats, 'timePlayed'),
                distanceTraveled: Stat(player.playerStats, 'distanceTraveled'),
                percentTimeMoving: Stat(player.playerStats, 'percentTimeMoving'),
            }
        })),
    }))
    
export const Record = (match: Schema.API.MW.WZ.Match): Schema.DB.MW.WZ.Match.Record => {
    // Count downs
    let downs = []
    const downKeys = Object.keys(match.playerStats).filter(key => key.includes('objectiveBrDownEnemyCircle'))
    for (const key of downKeys) {
        const circleIndex = Number(key.replace('objectiveBrDownEnemyCircle', ''))
        downs[circleIndex] = Stat(match.playerStats, key)
    }
    return {
        mapId: match.map,
        modeId: match.mode,
        matchId: match.matchID,
        endTime: match.utcEndSeconds,
        startTime: match.utcStartSeconds,
        player: {
            id: match.player.uno,
            team: match.player.team,
            username: match.player.username,
            clantag: match.player.clantag,
        },
        stats: {
            rank: Stat(match.playerStats, 'rank'),
            score: Stat(match.playerStats, 'score'),
            kills: Stat(match.playerStats, 'kills'),
            deaths: Stat(match.playerStats, 'deaths'),
            downs,
            gulagKills: Stat(match.playerStats, 'gulagKills'),
            gulagDeaths: Stat(match.playerStats, 'gulagDeaths'),
            eliminations: Stat(match.playerStats, 'objectiveLastStandKill'),
            damageDone: Stat(match.playerStats, 'damageDone'),
            damageTaken: Stat(match.playerStats, 'damageTaken'),
            teamWipes: Stat(match.playerStats, 'objectiveTeamWiped'),
            revives: Stat(match.playerStats, 'objectiveReviver'),
            contracts: Stat(match.playerStats, 'objectiveBrMissionPickupTablet'),
            lootCrates: Stat(match.playerStats, 'objectiveBrCacheOpen'),
            buyStations: Stat(match.playerStats, 'objectiveBrKioskBuy'),
            assists: Stat(match.playerStats, 'assists'),
            executions: Stat(match.playerStats, 'executions'),
            headshots: Stat(match.playerStats, 'headshots'),
            wallBangs: Stat(match.playerStats, 'wallBangs'),
            nearMisses: Stat(match.playerStats, 'nearmisses'),
            clusterKills: Stat(match.playerStats, 'objectiveMedalScoreSsKillTomaStrike'),
            airstrikeKills: Stat(match.playerStats, 'objectiveMedalScoreKillSsRadarDrone'),
            longestStreak: Stat(match.playerStats, 'longestStreak'),
            trophyDefense: Stat(match.playerStats, 'objectiveTrophyDefense'),
            munitionShares: Stat(match.playerStats, 'objectiveMunitionsBoxTeammateUsed'),
            missileRedirects: Stat(match.playerStats, 'objectiveManualFlareMissileRedirect'),
            equipmentDestroyed: Stat(match.playerStats, 'objectiveDestroyedEquipment'),
            percentTimeMoving: Stat(match.playerStats, 'percentTimeMoving'),
            distanceTraveled: Stat(match.playerStats, 'distanceTraveled'),
            teamSurvivalTime: Stat(match.playerStats, 'teamSurvivalTime'),
            teamPlacement: Stat(match.playerStats, 'teamPlacement'),
            timePlayed: Stat(match.playerStats, 'timePlayed'),
            xp: {
                score: Stat(match.playerStats, 'scoreXp'),
                match: Stat(match.playerStats, 'matchXp'),
                bonus: Stat(match.playerStats, 'bonusXp'),
                medal: Stat(match.playerStats, 'medalXp'),
                misc: Stat(match.playerStats, 'miscXp'),
                challenge: Stat(match.playerStats, 'challengeXp'),
                total: Stat(match.playerStats, 'totalXp'),
            }
        },
        loadouts: match.player.loadout.map(loadout => Loadout(loadout)),
    }
}