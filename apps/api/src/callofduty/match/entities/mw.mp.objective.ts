import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Schema } from 'callofduty'
import { Entity, Column, Repository, PrimaryColumn, InsertResult } from 'typeorm'
import { stat } from './normalizer'

/************************************************************************************************************
 * Modern Warfare - Multiplayer - Match Player Objective Stats
 ***********************************************************************************************************/
export const MwMpMatchObjectiveNormalizer = (match:Schema.MW.Match.MP, accountId:string) => {
  const objectives = []
  const matchId = match.matchID
  const combinedId = `${matchId}.${accountId}`
  for(const objectiveId of Object.keys(match.playerStats)) {
    const objectivesEarned = Number(match.playerStats[objectiveId])
    if (objectiveId.match(/^objective/) && objectivesEarned && !isNaN(objectivesEarned)) {
      objectives.push({ matchId, accountId, combinedId, objectiveId, objectivesEarned })
    }
  }
  return objectives
}

@Entity({ name: 'mw/mp/match/objectives', database: 'callofduty' })
export class MwMpMatchObjective {
    @PrimaryColumn('text', { unique: true })
    combinedId: string // <matchId>.<accountId>.<objectiveId>

    @Column('text')
    matchId: string

    @Column('uuid')
    accountId: string

    @Column('citext')
    objectiveId: string

    @Column('smallint')
    objectivesEarned: number
}
@Injectable()
export class MwMpMatchObjectiveDAO {
    constructor(
      @InjectRepository(MwMpMatchObjective, 'callofduty') private repo: Repository<MwMpMatchObjective>,
    ) {}
    private normalizeModel(model:Partial<MwMpMatchObjective>) {
      return {
        ...model,
        combinedId: `${model.matchId}.${model.accountId}.${model.objectiveId}`,
      }
    }
    public async insert(model:Partial<MwMpMatchObjective>):Promise<InsertResult> {
      return this.repo.createQueryBuilder()
        .insert()
        .into(MwMpMatchObjective)
        .values(this.normalizeModel(model))
        .execute()
    }
    public async findById(matchId:string, accountId:string):Promise<MwMpMatchObjective> {
        return this.repo.findOne({ where: { accountId, matchId } })
    }
}
