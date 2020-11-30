import { Schema } from 'callofduty'
import { stat } from './normalizer'
import { CallOfDuty } from '@stagg/db'

/************************************************************************************************************
 * Modern Warfare - Multiplayer - Match Player Stats
 ***********************************************************************************************************/
export const MwMpMatchStatsNormalizer = (match: Schema.MW.Match.MP, account: CallOfDuty.Account.Base.Entity): Partial<CallOfDuty.Match.MW.MP.Stats.Entity> => ({
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
  quit: !match.isPresentAtEnd,
  score: stat(match.playerStats, 'score'),
  scoreAxis: match.team2Score,
  scoreAllies: match.team1Score,
  timePlayed: stat(match.playerStats, 'timePlayed'),
  teamPlacement: match.result === 'win' ? 1 : match.result === 'loss' ? 2 : 0,
  damageDone: stat(match.playerStats, 'damageDone'),
  damageTaken: stat(match.playerStats, 'damageTaken'),
  kills: stat(match.playerStats, 'kills'),
  deaths: stat(match.playerStats, 'deaths'),
  assists: stat(match.playerStats, 'assists'),
  suicides: stat(match.playerStats, 'suicides'),
  executions: stat(match.playerStats, 'executions'),
  headshots: stat(match.playerStats, 'headshots'),
  shotsHit: stat(match.playerStats, 'shotsLanded'),
  shotsMiss: stat(match.playerStats, 'shotsMissed'),
  wallBangs: stat(match.playerStats, 'wallBangs'),
  nearMisses: stat(match.playerStats, 'nearMisses'),
  longestStreak: stat(match.playerStats, 'longestStreak'),
  distanceTraveled: stat(match.playerStats, 'distanceTraveled'),
  percentTimeMoving: stat(match.playerStats, 'percentTimeMoving'),
  avgSpeed: stat(match.playerStats, 'averageSpeedDuringMatch'),
  seasonRank: stat(match.playerStats, 'seasonRank'),
  scoreXp: stat(match.playerStats, 'scoreXp'),
  matchXp: stat(match.playerStats, 'matchXp'),
  bonusXp: stat(match.playerStats, 'bonusXp'),
  medalXp: stat(match.playerStats, 'medalXp'),
  miscXp: stat(match.playerStats, 'miscXp'),
  challengeXp: stat(match.playerStats, 'challengeXp'),
  totalXp: stat(match.playerStats, 'totalXp'),
} as CallOfDuty.Match.MW.MP.Stats.Entity)
