import { Schema } from 'callofduty'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Entity, Column, Repository, PrimaryColumn, InsertResult } from 'typeorm'
import { loadouts } from './normalizer'

/************************************************************************************************************
 * Modern Warfare - Warzone - Match Player Killstreak Stats
 ***********************************************************************************************************/
export const MwWzMatchLoadoutNormalizer = loadouts

@Entity({ name: 'mw/wz/match/loadouts', database: 'callofduty' })
export class MwWzMatchLoadout {
    @PrimaryColumn('text', { unique: true })
    hashId: string // objHash(loadout)

    @Column('text')
    matchId: string

    @Column('uuid')
    accountId: string

    @Column('citext')
    pwId: Schema.MW.Weapon.Name

    @Column('smallint')
    pwVariant: number

    @Column('citext', { array: true })
    pwAttachments: string[]

    @Column('citext')
    swId: Schema.MW.Weapon.Name

    @Column('smallint')
    swVariant: number

    @Column('citext', { array: true })
    swAttachments: string[]

    @Column('citext')
    lethal: string

    @Column('citext')
    tactical: string

    @Column('citext', { array: true })
    perks: string[]
}
@Injectable()
export class MwWzMatchLoadoutDAO {
    constructor(
      @InjectRepository(MwWzMatchLoadout, 'callofduty') private repo: Repository<MwWzMatchLoadout>,
    ) {}
    private normalizeModel(model:Partial<MwWzMatchLoadout>) {
      return {
        ...model,
      }
    }
    public async insert(match:Partial<MwWzMatchLoadout>):Promise<InsertResult> {
      return this.repo.createQueryBuilder()
        .insert()
        .into(MwWzMatchLoadout)
        .values(this.normalizeModel(match))
        .execute()
    }
    public async findById(hashId:string):Promise<MwWzMatchLoadout> {
        return this.repo.findOne({ where: { hashId } })
    }
    public async findAllByMatchId(matchId:string, accountId:string):Promise<MwWzMatchLoadout[]> {
        return this.repo.find({ where: { matchId, accountId } })
    }
    public async findAllByAccountId(accountId:string):Promise<MwWzMatchLoadout[]> {
        return this.repo.find({ where: { accountId } })
    }
}
