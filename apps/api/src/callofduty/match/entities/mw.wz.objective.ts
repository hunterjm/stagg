import { Schema } from 'callofduty'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Entity, Column, Repository, PrimaryColumn, InsertResult } from 'typeorm'
import { stat } from './normalizer'

/************************************************************************************************************
 * Modern Warfare - Warzone - Match Player Objective Stats
 ***********************************************************************************************************/
export const MwWzMatchObjectiveNormalizer = (match:Schema.MW.Match.MP, accountId:string) => {
  const objectives = []
  const matchId = match.matchID
  for(const objectiveId of Object.keys(match.playerStats)) {
    const objectivesEarned = Number(match.playerStats[objectiveId])
    if (objectiveId.match(/^objective/) && objectivesEarned && !isNaN(objectivesEarned)) {
      objectives.push({ matchId, accountId, combinedId: `${matchId}.${accountId}.${objectiveId}`, objectiveId, objectivesEarned })
    }
  }
  return objectives
}

@Entity({ name: 'mw/wz/match/objectives', database: 'callofduty' })
export class MwWzMatchObjective {
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
export class MwWzMatchObjectiveDAO {
    constructor(
      @InjectRepository(MwWzMatchObjective, 'callofduty') private repo: Repository<MwWzMatchObjective>,
    ) {}
    private normalizeModel(model:Partial<MwWzMatchObjective>) {
      return {
        ...model,
      }
    }
    public async insert(model:Partial<MwWzMatchObjective>):Promise<InsertResult> {
      return this.repo.createQueryBuilder()
        .insert()
        .into(MwWzMatchObjective)
        .values(this.normalizeModel(model))
        .execute()
    }
    public async findById(matchId:string, accountId:string):Promise<MwWzMatchObjective> {
        return this.repo.findOne({ where: { accountId, matchId } })
    }
}
