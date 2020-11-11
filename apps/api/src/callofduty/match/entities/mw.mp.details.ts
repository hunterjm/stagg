import { Schema } from 'callofduty'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Entity, Column, Repository, PrimaryColumn, InsertResult } from 'typeorm'
import { Postgres } from 'src/util'


/************************************************************************************************************
 * Modern Warfare - Multiplayer - Match Details
 ***********************************************************************************************************/
export const MwMpMatchDetailsNormalizer = (match:Schema.MW.Match.MP) => ({
  matchId: match.matchID,
  modeId: match.mode,
  mapId: match.map,
  endTime: match.utcEndSeconds,
  startTime: match.utcStartSeconds,
})

@Entity({ name: 'mw/mp/match/details', database: 'callofduty' })
export class MwMpMatchDetails {
  @PrimaryColumn('text', { unique: true })
  matchId: string

  @Column('citext')
  modeId: Schema.MW.Mode.MP

  @Column('citext')
  mapId: Schema.MW.Map.MP

  @Column('integer')
  startTime: number

  @Column('integer')
  endTime: number

  @Column('timestamp')
  created: Date
}
@Injectable()
export class MwMpMatchDetailsDAO {
  constructor(
    @InjectRepository(MwMpMatchDetails, 'callofduty') private repo: Repository<MwMpMatchDetails>,
  ) {}
  private normalizeModel(model:MwMpMatchDetails) {
    return { ...model }
  }
  public async insert(model:MwMpMatchDetails):Promise<InsertResult> {
    return this.repo.createQueryBuilder()
      .insert()
      .into(MwMpMatchDetails)
      .values(this.normalizeModel(model))
      .execute()
  }
  public async findById(matchId:string):Promise<MwMpMatchDetails> {
      const match = await this.repo.findOne(matchId)
      return Postgres.Denormalize.Model<MwMpMatchDetails>(match)
  }
}
