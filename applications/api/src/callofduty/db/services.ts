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
    const whereClause = `account_id=$1 ${filterQuery ? `AND ${filterQuery}` : ''}`
    const query = ` SELECT  * FROM "callofduty/wz/matches" WHERE ${whereClause}`
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
    const rank = wzRank(results.length, rankStats.score, rankStats.kills, rankStats.deaths, rankStats.damageDone, rankStats.damageTaken)
    return { rank, results: formattedResults }
  }
  public async wzAggregateMatchData(account_id:string, filters:FilterUrlQuery) {
    const filterQuery = urlQueryToSql(filters)
    const whereClause = `account_id=$1 ${!filterQuery ? '' : `AND ${filterQuery}`}`
    const query = `
        SELECT 
          COUNT(*) as games,
          (SELECT COUNT(*) FROM "callofduty/wz/matches" WHERE stat_team_placement = 1 AND ${whereClause}) as "wins",
          (SELECT COUNT(*) FROM "callofduty/wz/matches" WHERE stat_gulag_kills > 0 AND ${whereClause}) as "winsGulag",
          (SELECT COUNT(*) FROM "callofduty/wz/matches" WHERE (stat_gulag_kills > 0 OR stat_gulag_deaths > 0) AND ${whereClause}) as "gamesGulag",
          (SELECT COUNT(*) FROM "callofduty/wz/matches" WHERE stat_team_placement <= 10 AND ${whereClause}) as "gamesTop10",
          (SELECT COUNT(*) FROM "callofduty/wz/matches" WHERE (stat_team_placement = 1 OR stat_team_survival_time > $2) AND ${whereClause}) as "finalCircles",
          SUM(stat_score) as "score",
          SUM(stat_kills) as "kills",
          SUM(stat_deaths) as "deaths",
          SUM(stat_avg_life_time) as "lifespan",
          SUM(stat_damage_done) as "damageDone",
          SUM(stat_damage_taken) as "damageTaken",
          SUM(stat_team_wipes) as "teamWipes",
          SUM(stat_longest_streak) as "killstreak",
          SUM(stat_executions) as "executions",
          SUM(stat_headshots) as "headshots",
          SUM(stat_revives) as "revives",
          SUM(stat_contracts) as "contracts",
          SUM(stat_loot_crates) as "lootCrates",
          SUM(stat_buy_stations) as "buyStations",
          SUM(stat_gulag_kills) as "gulagKills",
          SUM(stat_gulag_deaths) as "gulagDeaths",
          SUM(stat_cluster_kills) as "clusterKills",
          SUM(stat_airstrike_kills) as "airstrikeKills",
          SUM(stat_trophy_defense) as "trophyDefense",
          SUM(stat_munition_shares) as "munitionShares",
          SUM(stat_missile_redirects) as "missileRedirects",
          SUM(stat_equipment_destroyed) as "equipmentDestroyed",
          SUM(stat_time_played) as "timePlayed",
          SUM(stat_team_placement) as "teamPlacement",
          SUM(stat_distance_traveled) as "distanceTraveled",
          SUM(stat_team_survival_time) as "teamSurvivalTime",
          SUM(stat_percent_time_moving) as "percentTimeMoving",
          MAX(stat_kills) as "mostKills",
          MAX(stat_deaths) as "mostDeaths",
          MAX(stat_revives) as "mostRevives",
          MAX(stat_headshots) as "mostHeadshots",
          MAX(stat_damage_done) as "mostDamageDone",
          MAX(stat_damage_taken) as "mostDamageTaken",
          MAX(stat_longest_streak) as "bestKillstreak"
        FROM "callofduty/wz/matches"
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
    const rank = wzRank(result.games, result.score, result.kills, result.deaths, result.damageDone, result.damageTaken)
    return { rank, results: result }
  }
}