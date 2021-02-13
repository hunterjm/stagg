import { createConnection } from 'typeorm'
import { connectionConfig } from '@stagg/db'
import { PGSQL } from './config'
import * as express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'
import { MatchHistoryService } from './match-history'
import { buildParameters, Filter } from './match-history/parameters'

var schema = buildSchema(`
  input Filter {
    and: [Filter!]
    or: [Filter!]

    modeId_eq: String
    modeId_neq: String
    modeId_in: [String!]
    
    startTime_lt: Int
    startTime_gt: Int

    endTime_lt: Int
    endTime_gt: Int

    teamId_eq: String
    teamId_neq: String
    teamId_in: [String!]

    quit_eq: Boolean

    teamPlacement_eq: Int
    teamPlacement_neq: Int
    teamPlacement_lt: Int
    teamPlacement_gt: Int
  }

  input MatchInput {
    accountId: String!
    filter: Filter
    limit: Int
    offset: Int
  }

  type Query {
    mwMpMatch(input: MatchInput): [MwMpMatch!]!
    mwWzMatch(input: MatchInput): [MwWzMatch!]!
  }

  interface Match {
    matchId: String!
    accountId: String!
    modeId: String
    mapId: String
    startTime: Int
    endTime: Int
    teamId: String
    unoId: String
    username: String
    clantag: String
    score: Int
    timePlayed: Int
    avgLifeTime: Float
    teamPlacement: Int
    damageDone: Int
    damageTaken: Int
    kills: Int
    deaths: Int
    executions: Int
    headshots: Int
    longestStreak: Int
    distanceTraveled: Float
    percentTimeMoving: Float
    scoreXp: Int
    matchXp: Int
    bonusXp: Int
    medalXp: Int
    miscXp: Int
    challengeXp: Int
    totalXp: Int

    loadouts: [Loadout!]!
    objectives: [Objective!]!
  }

  type MwWzMatch implements Match {
    matchId: String!
    accountId: String!
    modeId: String
    mapId: String
    startTime: Int
    endTime: Int
    teamId: String
    unoId: String
    username: String
    clantag: String
    score: Int
    timePlayed: Int
    avgLifeTime: Float
    teamPlacement: Int
    damageDone: Int
    damageTaken: Int
    kills: Int
    deaths: Int
    executions: Int
    headshots: Int
    longestStreak: Int
    distanceTraveled: Float
    percentTimeMoving: Float
    scoreXp: Int
    matchXp: Int
    bonusXp: Int
    medalXp: Int
    miscXp: Int
    challengeXp: Int
    totalXp: Int

    loadouts: [Loadout!]!
    objectives: [Objective!]!


    teamSurvivalTime: Int
    downs: [Int]!
    eliminations: Int
    teamWipes: Int
    revives: Int
    contracts: Int
    lootCrates: Int
    buyStations: Int
    gulagKills: Int
    gulagDeaths: Int
    clusterKills: Int
    airstrikeKills: Int
    equipmentDestroyed: Int
    trophyDefense: Int
    munitionShares: Int
    missileRedirects: Int
  }

  type MwMpMatch implements Match {
    matchId: String!
    accountId: String!
    modeId: String
    mapId: String
    startTime: Int
    endTime: Int
    teamId: String
    unoId: String
    username: String
    clantag: String
    score: Int
    timePlayed: Int
    avgLifeTime: Float
    teamPlacement: Int
    damageDone: Int
    damageTaken: Int
    kills: Int
    deaths: Int
    executions: Int
    headshots: Int
    longestStreak: Int
    distanceTraveled: Float
    percentTimeMoving: Float
    scoreXp: Int
    matchXp: Int
    bonusXp: Int
    medalXp: Int
    miscXp: Int
    challengeXp: Int
    totalXp: Int

    loadouts: [Loadout!]!
    objectives: [Objective!]!


    quit: Boolean
    scoreAxis: Int
    scoreAllies: Int
    suicides: Int
    assists: Int
    shotsHit: Int
    shotsMiss: Int
    wallBangs: Int
    nearMisses: Int
    avgSpeed: Float
    seasonRank: Int

    killstreaks: [Killstreak!]!
    weapons: [Weapon!]!
  }

  type Weapon {
    weaponId: String!
    loadoutIndex: Int!
    kills: Int
    deaths: Int
    headshots: Int
    shotsHit: Int
    shotsMiss: Int
    xpStart: Int
    xpEarned: Int
  }

  type Killstreak {
    killstreakId: String!
    uses: Int
    kills: Int
    takedowns: Int
  }

  type Loadout {
    pwId: String
    pwVariant: Int
    pwAttachments: [String!]!
    swId: String
    swVariant: Int
    swAttachments: [String!]!
    lethal: String
    tactical: String
    perks: [String!]!
    killstreaks: [String]
  }

  type Objective {
    objectiveId: String
    objectivesEarned: Int
  }
`)

interface Context {
  service: MatchHistoryService
}

interface MatchInput {
  input: {
    accountId: string
    filter: Filter
    limit: number
    offset: number
  }
}

const root = {
  mwWzMatch: async ({ input }: MatchInput, { service }: Context) => {
    const { accountId, filter, limit, offset } = input
    if (!accountId) return []

    const params = buildParameters(accountId, 'mw', 'wz', limit, offset, filter)
    const stats = await service.getHistoryByAccountId(params)

    return stats.map(stat => {
      stat.loadouts = async () => {
        return service.getLoadoutsByMatch(params, stat.matchId)
      }
      stat.objectives = async () => {
        return service.getObjectivesByMatch(params, stat.matchId)
      }
      return stat
    })
  },
  mwMpMatch: async({ input }: MatchInput, { service }: Context) => {
    const { accountId, filter, limit, offset } = input
    if (!accountId) return []

    const params = buildParameters(accountId, 'mw', 'mp', limit, offset, filter)
    const stats = await service.getHistoryByAccountId(params)

    return stats.map(stat => {
      stat.loadouts = async () => {
        return service.getLoadoutsByMatch(params, stat.matchId)
      }
      stat.objectives = async () => {
        return service.getObjectivesByMatch(params, stat.matchId)
      }
      stat.killstreaks = async () => {
        return service.getKillstreaksByMatch(params, stat.matchId)
      }
      stat.weapons = async () => {
        return service.getWeaponsByMatch(params, stat.matchId)
      }
      return stat
    })
  }
}

const config = connectionConfig('callofduty', PGSQL)
createConnection(
  config
).then(() => {
  const service = new MatchHistoryService()

  const app = express()
  app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    context: { service } as Context,
    graphiql: true,
  }))
  app.listen(4000,
    () => console.log('Now browse to localhost:4000/graphql')
  )
}).catch(e => {
  console.log(e)
})