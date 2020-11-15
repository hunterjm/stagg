import { Schema } from 'callofduty'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Entity, Column, Repository, PrimaryColumn, InsertResult, UpdateResult } from 'typeorm'
import { stat } from './normalizer'

/************************************************************************************************************
 * Modern Warfare - Warzone - Match Player Stats
 ***********************************************************************************************************/
export const MwWzMatchStatsNormalizer = (match:Schema.MW.Match.WZ):Partial<MwWzMatchStats> => {
  // Count downs
  let downs = []
  const downKeys = Object.keys(match.playerStats).filter(key => key.includes('objectiveBrDownEnemyCircle'))
  for (const key of downKeys) {
      const circleIndex = Number(key.replace('objectiveBrDownEnemyCircle', ''))
      downs[circleIndex] = stat(match.playerStats, key)
  }
  return {
      matchId: match.matchID,
      modeId: match.mode,
      mapId: match.map,
      startTime: match.utcStartSeconds,
      endTime: match.utcEndSeconds,
      teamId: match.player.team,
      username: match.player.username,
      unoId: match.player.uno,
      clantag: match.player.clantag,
      score: stat(match.playerStats, 'score'),
      kills: stat(match.playerStats, 'kills'),
      deaths: stat(match.playerStats, 'deaths'),
      downs,
      gulagKills: stat(match.playerStats, 'gulagKills'),
      gulagDeaths: stat(match.playerStats, 'gulagDeaths'),
      eliminations: stat(match.playerStats, 'objectiveLastStandKill'),
      damageDone: stat(match.playerStats, 'damageDone'),
      damageTaken: stat(match.playerStats, 'damageTaken'),
      teamWipes: stat(match.playerStats, 'objectiveTeamWiped'),
      revives: stat(match.playerStats, 'objectiveReviver'),
      contracts: stat(match.playerStats, 'objectiveBrMissionPickupTablet'),
      lootCrates: stat(match.playerStats, 'objectiveBrCacheOpen'),
      buyStations: stat(match.playerStats, 'objectiveBrKioskBuy'),
      executions: stat(match.playerStats, 'executions'),
      headshots: stat(match.playerStats, 'headshots'),
      clusterKills: stat(match.playerStats, 'objectiveMedalScoreSsKillTomaStrike'),
      airstrikeKills: stat(match.playerStats, 'objectiveMedalScoreKillSsRadarDrone'),
      longestStreak: stat(match.playerStats, 'longestStreak'),
      trophyDefense: stat(match.playerStats, 'objectiveTrophyDefense'),
      munitionShares: stat(match.playerStats, 'objectiveMunitionsBoxTeammateUsed'),
      missileRedirects: stat(match.playerStats, 'objectiveManualFlareMissileRedirect'),
      equipmentDestroyed: stat(match.playerStats, 'objectiveDestroyedEquipment'),
      percentTimeMoving: stat(match.playerStats, 'percentTimeMoving'),
      distanceTraveled: stat(match.playerStats, 'distanceTraveled'),
      teamSurvivalTime: stat(match.playerStats, 'teamSurvivalTime'),
      teamPlacement: stat(match.playerStats, 'teamPlacement'),
      timePlayed: stat(match.playerStats, 'timePlayed'),
      scoreXp: stat(match.playerStats, 'scoreXp'),
      matchXp: stat(match.playerStats, 'matchXp'),
      bonusXp: stat(match.playerStats, 'bonusXp'),
      medalXp: stat(match.playerStats, 'medalXp'),
      miscXp: stat(match.playerStats, 'miscXp'),
      challengeXp: stat(match.playerStats, 'challengeXp'),
      totalXp: stat(match.playerStats, 'totalXp'),
  }
}

@Entity({ name: 'mw/wz/match/stats', database: 'callofduty' })
export class MwWzMatchStats {
    @PrimaryColumn('text', { unique: true })
    combinedId: string // <matchId>.<accountId>
    
    @Column('text')
    matchId: string
  
    @Column('uuid')
    accountId: string
  
    @Column('citext')
    modeId: Schema.MW.Mode.WZ
  
    @Column('citext')
    mapId: Schema.MW.Map.WZ

    @Column('integer')
    startTime: number
  
    @Column('integer')
    endTime: number
  
    @Column('citext')
    teamId: string
  
    @Column('citext')
    unoId: string
  
    @Column('citext')
    username: string
  
    @Column('citext')
    clantag: string
  
    @Column('integer')
    score: number
  
    @Column('numeric')
    timePlayed: number
  
    @Column('numeric', { nullable: true })
    avgLifeTime: number
  
    @Column('integer')
    teamPlacement: number
  
    @Column('integer')
    teamSurvivalTime: number
  
    @Column('integer')
    damageDone: number
  
    @Column('integer')
    damageTaken: number
  
    @Column('integer')
    kills: number
  
    @Column('integer')
    deaths: number
  
    @Column('integer', { array: true })
    downs: number[]
  
    @Column('integer')
    eliminations: number
  
    @Column('integer')
    teamWipes: number
  
    @Column('integer')
    executions: number
  
    @Column('integer')
    headshots: number
  
    @Column('integer')
    revives: number
  
    @Column('integer')
    contracts: number
  
    @Column('integer')
    lootCrates: number
  
    @Column('integer')
    buyStations: number
  
    @Column('integer')
    gulagKills: number
  
    @Column('integer')
    gulagDeaths: number
  
    @Column('integer')
    clusterKills: number
  
    @Column('integer')
    airstrikeKills: number
  
    @Column('integer')
    longestStreak: number
  
    @Column('numeric')
    distanceTraveled: number
  
    @Column('numeric')
    percentTimeMoving: number
  
    @Column('integer')
    equipmentDestroyed: number
  
    @Column('integer')
    trophyDefense: number
  
    @Column('integer')
    munitionShares: number
  
    @Column('integer')
    missileRedirects: number
  
    @Column('integer')
    scoreXp: number
  
    @Column('integer')
    matchXp: number
  
    @Column('integer')
    bonusXp: number
  
    @Column('integer')
    medalXp: number
  
    @Column('integer')
    miscXp: number
  
    @Column('integer')
    challengeXp: number
  
    @Column('integer')
    totalXp: number
  
    @Column('timestamp')
    created: Date
}
@Injectable()
export class MwWzMatchStatsDAO {
    constructor(
      @InjectRepository(MwWzMatchStats, 'callofduty') private repo: Repository<MwWzMatchStats>,
    ) {}
    private normalizeModel(model:Partial<MwWzMatchStats>) {
      return {
        ...model,
        combinedId: `${model.matchId}.${model.accountId}`,
      }
    }
    public async insert(model:Partial<MwWzMatchStats>):Promise<InsertResult> {
      return this.repo.createQueryBuilder()
        .insert()
        .into(MwWzMatchStats)
        .values(this.normalizeModel(model))
        .execute()
    }
    public async update(model:Partial<MwWzMatchStats>):Promise<UpdateResult> {
      const record = await this.findById(model.matchId, model.accountId)
      return this.repo.createQueryBuilder()
        .update()
        .set(this.normalizeModel({ ...record, ...model }))
        .where({ matchId: model.matchId, accountId: model.accountId })
        .execute()
    }
    public async findById(matchId:string, accountId:string):Promise<MwWzMatchStats> {
        return this.repo.findOne({ where: { accountId, matchId } })
    }
    public async findByAccountId(accountId:string, limit?:number, offset?:number):Promise<MwWzMatchStats[]> {
      return this.repo.createQueryBuilder()
        .select('*')
        .where({ accountId })
        .addOrderBy('"startTime"', 'DESC')
        .offset(offset || 0)
        .limit(limit || 0)
        .execute()
    }
}
