import { Schema } from 'callofduty'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Entity, Column, Repository, PrimaryColumn, InsertResult } from 'typeorm'
import { loadouts } from './normalizer'

/************************************************************************************************************
 * Modern Warfare - Multiplayer - Match Player Killstreak Stats
 ***********************************************************************************************************/
export const MwMpMatchLoadoutNormalizer = loadouts

@Entity({ name: 'mw/mp/match/loadouts', database: 'callofduty' })
export class MwMpMatchLoadout {
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

    @Column('citext', { array: true })
    killstreaks: Schema.MW.Killstreak[]
}
@Injectable()
export class MwMpMatchLoadoutDAO {
    constructor(
      @InjectRepository(MwMpMatchLoadout, 'callofduty') private repo: Repository<MwMpMatchLoadout>,
    ) {}
    private normalizeModel(model:Partial<MwMpMatchLoadout>) {
      return {
        ...model,
      }
    }
    public async insert(match:Partial<MwMpMatchLoadout>):Promise<InsertResult> {
      return this.repo.createQueryBuilder()
        .insert()
        .into(MwMpMatchLoadout)
        .values(this.normalizeModel(match))
        .execute()
    }
    public async findById(hashId:string):Promise<MwMpMatchLoadout> {
        return this.repo.findOne({ where: { hashId } })
    }
    public async findAllByMatchId(matchId:string, accountId:string):Promise<MwMpMatchLoadout[]> {
        return this.repo.find({ where: { matchId, accountId } })
    }
    public async findAllByAccountId(accountId:string):Promise<MwMpMatchLoadout[]> {
        return this.repo.find({ where: { accountId } })
    }
}
