import { Schema } from 'callofduty'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Entity, Column, Repository, PrimaryColumn, InsertResult } from 'typeorm'
import { Postgres } from 'src/util'


/************************************************************************************************************
 * Modern Warfare - Warzone - Match Details
 ***********************************************************************************************************/
export const MwWzMatchDetailsNormalizer = (match:Schema.MW.Match.WZ) => ({
  matchId: match.matchID,
  modeId: match.mode,
  mapId: match.map,
  endTime: match.utcEndSeconds,
  startTime: match.utcStartSeconds,
})

@Entity({ name: 'mw/wz/match/details', database: 'callofduty' })
export class MwWzMatchDetails {
  @PrimaryColumn('text', { unique: true })
  matchId: string

  @Column('citext')
  modeId: Schema.MW.Mode.WZ

  @Column('citext')
  mapId: Schema.MW.Map.WZ

  @Column('integer')
  startTime: number

  @Column('integer')
  endTime: number

  @Column('timestamp')
  created: Date
}
@Injectable()
export class MwWzMatchDetailsDAO {
  constructor(
    @InjectRepository(MwWzMatchDetails, 'callofduty') private repo: Repository<MwWzMatchDetails>,
  ) {}
  private normalizeModel(model:MwWzMatchDetails) {
    return { ...model }
  }
  public async insert(model:MwWzMatchDetails):Promise<InsertResult> {
    return this.repo.createQueryBuilder()
      .insert()
      .into(MwWzMatchDetails)
      .values(this.normalizeModel(model))
      .execute()
  }
  public async findById(matchId:string):Promise<MwWzMatchDetails> {
      const match = await this.repo.findOne(matchId)
      return Postgres.Denormalize.Model<MwWzMatchDetails>(match)
  }
}
