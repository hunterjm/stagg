import { Schema } from '@stagg/callofduty'
import { Stat, Loadout } from '..'

export const Match = (match: Schema.API.MW.WZ.Match):Schema.DB.MW.WZ.Match => ({
    matchId: match.matchID,
    modeId: match.mode,
    mapId: match.map,
    endTime: match.utcEndSeconds,
    startTime: match.utcStartSeconds,
    teams: Teams(match)
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
            platform: player.platform,
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
    
export const Performance = (match: Schema.API.MW.WZ.Match, player: Partial<Schema.DB.Account>): Schema.DB.MW.WZ.Performance => {
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
            _id: player._id,
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