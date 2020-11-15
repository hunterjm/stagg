import { Schema } from 'callofduty'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Entity, Column, Repository, PrimaryColumn, InsertResult, UpdateResult } from 'typeorm'
import { stat } from './normalizer'

/************************************************************************************************************
 * Modern Warfare - Multiplayer - Match Player Stats
 ***********************************************************************************************************/
export const MwMpMatchStatsNormalizer = (match:Schema.MW.Match.MP):Partial<MwMpMatchStats> => ({
    matchId: match.matchID,
    modeId: match.mode,
    mapId: match.map,
    startTime: match.utcStartSeconds,
    endTime: match.utcEndSeconds,
    teamId: match.player.team,
    unoId: match.player.uno,
    username: match.player.username,
    clantag: match.player.clantag,
    quit: !match.isPresentAtEnd,
    seasonRank: stat(match.playerStats, 'seasonRank'),
    score: stat(match.playerStats, 'score'),
    scoreAxis: match.team2Score,
    scoreAllies: match.team1Score,
    kills: stat(match.playerStats, 'kills'),
    deaths: stat(match.playerStats, 'deaths'),
    assists: stat(match.playerStats, 'assists'),
    suicides: stat(match.playerStats, 'suicides'),
    executions: stat(match.playerStats, 'executions'),
    headshots: stat(match.playerStats, 'headshots'),
    wallBangs: stat(match.playerStats, 'wallBangs'),
    nearMisses: stat(match.playerStats, 'nearMisses'),
    longestStreak: stat(match.playerStats, 'longestStreak'),
    timePlayed: stat(match.playerStats, 'timePlayed'),
    teamPlacement: match.result === 'win' ? 1 : match.result === 'loss' ? 2 : 0,
    damageDone: stat(match.playerStats, 'damageDone'),
    damageTaken: stat(match.playerStats, 'damageTaken'),
    avgSpeed: stat(match.playerStats, 'averageSpeedDuringMatch'),
    percentTimeMoving: stat(match.playerStats, 'percentTimeMoving'),
    distanceTraveled: stat(match.playerStats, 'distanceTraveled'),
    shotsHit: stat(match.playerStats, 'shotsLanded'),
    shotsMiss: stat(match.playerStats, 'shotsMissed'),
    scoreXp: stat(match.playerStats, 'scoreXp'),
    matchXp: stat(match.playerStats, 'matchXp'),
    medalXp: stat(match.playerStats, 'medalXp'),
    miscXp: stat(match.playerStats, 'miscXp'),
    totalXp: stat(match.playerStats, 'totalXp'),
    bonusXp: stat(match.playerStats, 'bonusXp'),
    challengeXp: stat(match.playerStats, 'challengeXp'),
})

@Entity({ name: 'mw/mp/match/stats', database: 'callofduty' })
export class MwMpMatchStats {
    @PrimaryColumn('text', { unique: true })
    combinedId: string // <matchId>.<accountId>

    @Column('text')
    matchId: string

    @Column('uuid')
    accountId: string

    @Column('citext')
    modeId: Schema.MW.Mode.MP

    @Column('citext')
    mapId: Schema.MW.Map.MP

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

    @Column('citext', { nullable: true })
    clantag: string

    @Column('boolean')
    quit: boolean

    @Column('integer')
    score: number

    @Column('integer')
    scoreAxis: number

    @Column('integer')
    scoreAllies: number

    @Column('numeric')
    timePlayed: number

    @Column('numeric', { nullable: true })
    avgLifeTime: number

    @Column('integer')
    teamPlacement: number

    @Column('integer')
    damageDone: number

    @Column('integer')
    damageTaken: number

    @Column('integer')
    kills: number

    @Column('integer')
    deaths: number

    @Column('integer')
    suicides: number

    @Column('integer')
    assists: number

    @Column('integer')
    executions: number

    @Column('integer')
    headshots: number

    @Column('integer')
    shotsHit: number

    @Column('integer')
    shotsMiss: number

    @Column('integer')
    wallBangs: number

    @Column('integer')
    nearMisses: number

    @Column('integer')
    longestStreak: number

    @Column('numeric')
    distanceTraveled: number

    @Column('numeric')
    percentTimeMoving: number

    @Column('numeric')
    avgSpeed: number

    @Column('integer')
    seasonRank: number

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
export class MwMpMatchStatsDAO {
    constructor(
      @InjectRepository(MwMpMatchStats, 'callofduty') private repo: Repository<MwMpMatchStats>,
    ) {}
    private normalizeModel(model:Partial<MwMpMatchStats>) {
      return {
        ...model,
        combinedId: `${model.matchId}.${model.accountId}`,
      }
    }
    public async insert(model:Partial<MwMpMatchStats>):Promise<InsertResult> {
      return this.repo.createQueryBuilder()
        .insert()
        .into(MwMpMatchStats)
        .values(this.normalizeModel(model))
        .execute()
    }
    public async update(model:Partial<MwMpMatchStats>):Promise<UpdateResult> {
      const record = await this.findById(model.matchId, model.accountId)
      return this.repo.createQueryBuilder()
        .update()
        .set(this.normalizeModel({ ...record, ...model }))
        .where({ matchId: model.matchId, accountId: model.accountId })
        .execute()
    }
    public async findById(matchId:string, accountId:string):Promise<MwMpMatchStats> {
        return this.repo.findOne({ where: { accountId, matchId } })
    }
    public async findByAccountId(accountId:string, limit?:number, offset?:number):Promise<MwMpMatchStats[]> {
        return this.repo.createQueryBuilder()
          .select('*')
          .where({ accountId })
          .addOrderBy('created', 'DESC')
          .offset(offset || 0)
          .limit(limit || 0)
          .execute()
    }
}
