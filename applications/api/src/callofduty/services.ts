import API from '@callofduty/api'
import * as Schema from '@callofduty/types'
import * as Assets from '@callofduty/assets'
import {
  Injectable,
  BadGatewayException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common'
import { getManager } from 'typeorm'
import { urlQueryToSql, FilterUrlQuery } from './filters'
import { wzRank } from './rank'
import { denormalizeWzMatch } from './model'

@Injectable()
export class CallOfDutyAPI {
  public async authorizeCredentials(email:string, password:string):Promise<Schema.Tokens> {
    const api = new API()
    try {
      const tokens = await api.Authorize(email, password) // will throw if fail
      return tokens
    } catch(e) {
      throw new UnauthorizedException(e)
    }
  }
  public async fetchIdentity(tokens:Schema.Tokens):Promise<{ games: Schema.Game[], profiles: Schema.PlatformId[] }> {
    const api = new API(tokens)
    const games:Schema.Game[] = []
    const profiles:Schema.PlatformId[] = []
    const { titleIdentities } = await api.Identity()
    if (!titleIdentities.length) {
      throw new BadGatewayException('identity empty')
    }
    for(const { title, platform, username } of titleIdentities) {
      if (!games.includes(title)) {
        games.push(title)
      }
      if (!profiles.filter(p => p.username === username && p.platform === platform).length) {
        profiles.push({ platform, username })
      }
    }
    return { games, profiles }
  }
  public async fetchAccounts(tokens:Schema.Tokens, profile:Schema.PlatformId):Promise<Schema.PlatformId[]> {
    const api = new API(tokens)
    const accounts = await api.Accounts(profile)
    const profiles:Schema.PlatformId[] = []
    for(const platform in accounts) {
      const { username } = accounts[platform]
      profiles.push({ platform: platform as Schema.Platform, username })
    }
    return profiles
  }
  public async fetchUnoId(tokens:Schema.Tokens, { username, platform }:Schema.PlatformId):Promise<Schema.UnoId> {
    const api = new API(tokens)
    const { matches: [ firstWzMatch ] } = await api.MatchHistory({ username, platform }, 'wz', 'mw', 0, 1)
    if (firstWzMatch) {
      return { unoId: firstWzMatch.player.uno }
    }
    const { matches: [ firstMpMatch ] } = await api.MatchHistory({ username, platform }, 'mp', 'mw', 0, 1)
    if (!firstMpMatch) {
      throw new BadRequestException('unoId only available in Modern Warfare / Warzone')
    }
    return { unoId: firstMpMatch.player.uno }
  }
}

@Injectable()
export class CallOfDutyDB {
  constructor(
  ) {}
  public async wzMatchHistoryData(account_id:string, filters:FilterUrlQuery) {
    const manager = getManager()
    const filterQuery = urlQueryToSql(filters)
    const queryAddition = filterQuery.match(/^ +?limit/i) ? filterQuery : ` AND ${filterQuery}`
    const whereClause = `account_id=$1 ${queryAddition}`
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
    const rank = wzRank(results.length, rankStats.score, rankStats.kills, rankStats.deaths)
    return { rank, results: formattedResults }
  }
  public async wzAggregateMatchData(account_id:string, filters:FilterUrlQuery) {
    const filterQuery = urlQueryToSql(filters)
    const hasMatchLimit = filterQuery.toLowerCase().includes('limit')
    const hasMatchOffset = filterQuery.toLowerCase().includes('offset')
    if (hasMatchLimit || hasMatchOffset) {
      throw new BadRequestException('match-based limit/skip not allowed on aggregate results; time-based limit/skip only')
    }
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
    const rank = wzRank(result.games, result.score, result.kills, result.deaths)
    return { rank, results: result }
  }
}
