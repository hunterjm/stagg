import { CallOfDuty } from '@stagg/db'
import { Schema } from 'callofduty'
import { stat } from './normalizer'

/************************************************************************************************************
 * Modern Warfare - Warzone - Match Player Stats
 ***********************************************************************************************************/
export const MwWzMatchStatsNormalizer = (match:Schema.MW.Match.WZ, account:CallOfDuty.Account.Base.Entity):Partial<CallOfDuty.Match.MW.WZ.Stats.Entity> => {
  // Count downs
  let downs = []
  const downKeys = Object.keys(match.playerStats).filter(key => key.includes('objectiveBrDownEnemyCircle'))
  for (const key of downKeys) {
      const circleIndex = Number(key.replace('objectiveBrDownEnemyCircle', ''))
      downs[circleIndex] = stat(match.playerStats, key)
  }
  return {
      matchId: match.matchID,
      accountId: account.accountId,
      modeId: match.mode,
      mapId: match.map,
      startTime: match.utcStartSeconds,
      endTime: match.utcEndSeconds,
      teamId: match.player.team,
      unoId: match.player.uno,
      username: match.player.username,
      clantag: match.player.clantag,
      score: stat(match.playerStats, 'score'),
      timePlayed: stat(match.playerStats, 'timePlayed'),
      teamPlacement: stat(match.playerStats, 'teamPlacement'),
      teamSurvivalTime: stat(match.playerStats, 'teamSurvivalTime'),
      damageDone: stat(match.playerStats, 'damageDone'),
      damageTaken: stat(match.playerStats, 'damageTaken'),
      kills: stat(match.playerStats, 'kills'),
      deaths: stat(match.playerStats, 'deaths'),
      downs,
      eliminations: stat(match.playerStats, 'objectiveLastStandKill'),
      teamWipes: stat(match.playerStats, 'objectiveTeamWiped'),
      executions: stat(match.playerStats, 'executions'),
      headshots: stat(match.playerStats, 'headshots'),
      revives: stat(match.playerStats, 'objectiveReviver'),
      contracts: stat(match.playerStats, 'objectiveBrMissionPickupTablet'),
      lootCrates: stat(match.playerStats, 'objectiveBrCacheOpen'),
      buyStations: stat(match.playerStats, 'objectiveBrKioskBuy'),
      gulagKills: stat(match.playerStats, 'gulagKills'),
      gulagDeaths: stat(match.playerStats, 'gulagDeaths'),
      clusterKills: stat(match.playerStats, 'objectiveMedalScoreSsKillTomaStrike'),
      airstrikeKills: stat(match.playerStats, 'objectiveMedalScoreKillSsRadarDrone'),
      longestStreak: stat(match.playerStats, 'longestStreak'),
      distanceTraveled: stat(match.playerStats, 'distanceTraveled'),
      percentTimeMoving: stat(match.playerStats, 'percentTimeMoving'),
      equipmentDestroyed: stat(match.playerStats, 'objectiveDestroyedEquipment'),
      trophyDefense: stat(match.playerStats, 'objectiveTrophyDefense'),
      munitionShares: stat(match.playerStats, 'objectiveMunitionsBoxTeammateUsed'),
      missileRedirects: stat(match.playerStats, 'objectiveManualFlareMissileRedirect'),
      scoreXp: stat(match.playerStats, 'scoreXp'),
      matchXp: stat(match.playerStats, 'matchXp'),
      bonusXp: stat(match.playerStats, 'bonusXp'),
      medalXp: stat(match.playerStats, 'medalXp'),
      miscXp: stat(match.playerStats, 'miscXp'),
      challengeXp: stat(match.playerStats, 'challengeXp'),
      totalXp: stat(match.playerStats, 'totalXp'),
  } as CallOfDuty.Match.MW.WZ.Stats.Entity
}
