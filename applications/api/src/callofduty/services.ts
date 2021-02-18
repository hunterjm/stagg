import API from '@callofduty/api'
// import * as DB from '@stagg/db'
import * as Schema from '@callofduty/types'
import * as Assets from '@callofduty/assets'
import {
  Injectable,
  BadGatewayException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common'
import { getManager } from 'typeorm'
import { CONFIG } from 'src/config'
// import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class CallOfDutyApiService {
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
export class CallOfDutyDbService {
  constructor(
    // @InjectRepository(DB.Account.Entity, 'stagg') private readonly acctRepo: DB.Account.Repository,
  ) {}
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
          (SELECT string_agg(CAST(stat_team_placement AS varchar),',') AS plist FROM "callofduty/wz/matches" WHERE ${whereClause} GROUP BY 1) as "placements",
          (SELECT COUNT(*) FROM "callofduty/wz/matches" WHERE stat_team_placement = 1 AND ${whereClause}) as "wins",
          (SELECT COUNT(*) FROM "callofduty/wz/matches" WHERE stat_team_placement <= 10 AND ${whereClause}) as "gamesTop10",
          (SELECT COUNT(*) FROM "callofduty/wz/matches" WHERE stat_gulag_kills > 0 AND ${whereClause}) as "winsGulag",
          (SELECT COUNT(*) FROM "callofduty/wz/matches" WHERE stat_team_survival_time > $2 AND ${whereClause}) as "finalCircles",
          (SELECT COUNT(*) FROM "callofduty/wz/matches" WHERE (stat_gulag_kills > 0 OR stat_gulag_deaths > 0) AND ${whereClause}) as "gamesGulag",
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
        FROM "callofduty/wz/matches"
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