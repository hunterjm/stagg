// import * as DB from '@stagg/db'
import * as Assets from '@callofduty/assets'
import {
  Injectable,
} from '@nestjs/common'
import { getManager } from 'typeorm'
import { CONFIG } from 'src/config'
import { urlQueryToSql, FilterUrlQuery } from './filters'
import { wzRank } from './rank'
import { denormalizeWzMatch } from '../model'
// import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class CallOfDutyDbService {
  constructor(
    // @InjectRepository(DB.Account.Entity, 'stagg') private readonly acctRepo: DB.Account.Repository,
  ) {}
  public async wzMatchHistoryData(account_id:string, filters:FilterUrlQuery) {
    const manager = getManager()
    const filterQuery = urlQueryToSql(filters)
    const whereClause = `account_id=$1 AND ${filterQuery}`
    const query = ` SELECT  * FROM "callofduty/matches/wz" WHERE ${whereClause}`
    const results = await manager.query(query, [account_id])
    const formattedResults = []
    const rankStats = { score: 0, kills: 0, deaths: 0, damageDone: 0, damageTaken: 0 }
    for(const result of results) {
      rankStats.score += result.stat_score
      rankStats.kills += result.stat_kills
      rankStats.deaths += result.stat_deaths
      rankStats.damageDone += result.stat_damage_done
      rankStats.damageTaken += result.stat_damage_taken
      formattedResults.push(denormalizeWzMatch(result))
    }
    const rank = wzRank(rankStats.score, rankStats.kills, rankStats.deaths, rankStats.damageDone, rankStats.damageTaken)
    return { rank, results: formattedResults }
  }
  public async wzAggregateMatchData(account_id:string, filters:FilterUrlQuery) {
    const filterQuery = urlQueryToSql(filters)
    const whereClause = `account_id=$1 ${!filterQuery ? '' : `AND ${filterQuery}`}`
    const query = `
        SELECT 
          COUNT(*) as games,
          (SELECT COUNT(*) FROM "callofduty/matches/wz" WHERE stat_team_placement = 1 AND ${whereClause}) as "wins",
          (SELECT COUNT(*) FROM "callofduty/matches/wz" WHERE stat_gulag_kills > 0 AND ${whereClause}) as "winsGulag",
          (SELECT COUNT(*) FROM "callofduty/matches/wz" WHERE (stat_gulag_kills > 0 OR stat_gulag_deaths > 0) AND ${whereClause}) as "gamesGulag",
          (SELECT COUNT(*) FROM "callofduty/matches/wz" WHERE stat_team_placement <= 10 AND ${whereClause}) as "gamesTop10",
          (SELECT COUNT(*) FROM "callofduty/matches/wz" WHERE (stat_team_placement = 1 OR stat_team_survival_time > $2) AND ${whereClause}) as "finalCircles",
          SUM(stat_score) as "score",
          SUM(stat_kills) as "kills",
          SUM(stat_longest_streak) as "killstreak",
          MAX(stat_longest_streak) as "bestKillstreak",
          SUM(stat_deaths) as "deaths",
          SUM(stat_revives) as "revives",
          SUM(stat_damage_done) as "damageDone",
          SUM(stat_damage_taken) as "damageTaken",
          SUM(stat_gulag_kills) as "gulagKills",
          SUM(stat_gulag_deaths) as "gulagDeaths",
          SUM(stat_team_placement) as "teamPlacement",
          SUM(stat_time_played) as "timePlayed",
          SUM(stat_percent_time_moving) as "percentTimeMoving"
        FROM "callofduty/matches/wz"
        WHERE ${whereClause}
    `
    const manager = getManager()
    const maxCircleId = Math.max(...Assets.MW.Circles.map(c => c.circleId))
    const finalCircleTime = Assets.MW.CircleStartTime(maxCircleId-3) * 1000 // convert to ms
    const [result] = await manager.query(query, [account_id, finalCircleTime])
    // convert to nums
    for(const key in result) {
      result[key] = Number(result[key])
    }
    const rank = wzRank(result.score, result.kills, result.deaths, result.damageDone, result.damageTaken)
    return { rank, results: result }
  }
  public async getWzBarracksData(account_id:string, limit:number=0, skip:number=0, limitType:'matches'|'days'='days') {
    const manager = getManager()
    const maxCircleId = Math.max(...Assets.MW.Circles.map(c => c.circleId))
    const finalCircleTime = Assets.MW.CircleStartTime(maxCircleId-3) * 1000 // convert to ms
    const offsetMin = new Date().getTimezoneOffset()
    const limitHr = (limit+skip) * 24
    const limitMin = limitHr * 60 + offsetMin
    const skipHr = skip * 24
    const skipMin = skipHr * 60 + offsetMin
    const limitDate = new Date(Date.now() - limitMin * 60 * 1000)
    const limitTime = Math.round(limitDate.getTime() / 1000)
    const skipDate = new Date(Date.now() - skipMin * 60 * 1000)
    const skipTime = Math.round(skipDate.getTime() / 1000)
    let limitQuery = ''
    if (limitType === 'days') {
      if (limit) {
        limitQuery += ` AND end_time >= ${limitTime}`
      }
      if (skip) {
        limitQuery += ` AND end_time <= ${skipTime}`
      }
    }
    const whereClause = `account_id=$1 AND mode_id !~ 'dmz' ${limitQuery}`
    const query = `
        SELECT 
          COUNT(*) as games,
          (SELECT COUNT(*) FROM "callofduty/matches/wz" WHERE stat_team_placement = 1 AND ${whereClause}) as "wins",
          (SELECT COUNT(*) FROM "callofduty/matches/wz" WHERE stat_team_placement <= 10 AND ${whereClause}) as "gamesTop10",
          (SELECT COUNT(*) FROM "callofduty/matches/wz" WHERE stat_gulag_kills > 0 AND ${whereClause}) as "winsGulag",
          (SELECT COUNT(*) FROM "callofduty/matches/wz" WHERE stat_team_survival_time > $2 AND ${whereClause}) as "finalCircles",
          (SELECT COUNT(*) FROM "callofduty/matches/wz" WHERE (stat_gulag_kills > 0 OR stat_gulag_deaths > 0) AND ${whereClause}) as "gamesGulag",
          SUM(stat_score) as "score",
          SUM(stat_kills) as "kills",
          SUM(stat_longest_streak) as "killstreak",
          MAX(stat_longest_streak) as "bestKillstreak",
          SUM(stat_deaths) as "deaths",
          SUM(stat_revives) as "revives",
          SUM(stat_damage_done) as "damageDone",
          SUM(stat_damage_taken) as "damageTaken",
          SUM(stat_gulag_kills) as "gulagKills",
          SUM(stat_gulag_deaths) as "gulagDeaths",
          SUM(stat_team_placement) as "teamPlacement",
          SUM(stat_time_played) as "timePlayed",
          SUM(stat_percent_time_moving) as "percentTimeMoving"
        FROM "callofduty/matches/wz"
        WHERE ${whereClause}
    `
    const [result] = await manager.query(query, [account_id, finalCircleTime])
    // convert to nums
    for(const key in result) {
      result[key] = Number(result[key])
    }
    // derive rank
    const avgFinish = Math.round(result.teamPlacement / result.games) || 0
    const factors = [
        { weight: CONFIG.RANKING.WZ.KDR.weight, limitValue: CONFIG.RANKING.WZ.KDR.limit,  statValue: result.kills / result.deaths },
        { weight: CONFIG.RANKING.WZ.DDR.weight, limitValue: CONFIG.RANKING.WZ.DDR.limit,  statValue: result.damageDone / result.damageTaken },
        { weight: CONFIG.RANKING.WZ.POS.weight, limitValue: CONFIG.RANKING.WZ.POS.limit,  statValue: 150 - avgFinish },
    ]
    const factoredScores = []
    for(const factor of factors) {
        for(let i = 0; i < factor.weight; i++) {
            const value = factor.statValue / factor.limitValue
            factoredScores.push(Math.min(value, 1))
        }
    }
    const sum = factoredScores.reduce((a,b) => a+b)
    const avg = sum / factoredScores.length
    const rankValue = 1 + Math.max(0, Math.round(avg * (CONFIG.RANKING.tierNames.length * CONFIG.RANKING.ranksPerTier)))
    const rankTier = Math.floor(rankValue / CONFIG.RANKING.ranksPerTier)
    let rankQualifier = 'I'
    for(let i = 1; i < rankValue - (rankTier * CONFIG.RANKING.ranksPerTier); i++) {
        rankQualifier += 'I'
    }

    return { rankId: rankValue, rankLabel: `${CONFIG.RANKING.tierNames[rankTier]} ${rankQualifier}`,  ...result }
  }

}