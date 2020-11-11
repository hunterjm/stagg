import { Schema as CallOfDuty } from 'callofduty'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, UpdateResult } from 'typeorm'
import { Entity, Column, PrimaryColumn } from 'typeorm'
import { Postgres } from 'src/util'

@Entity({ name: 'accountsnew/auth', database: 'callofduty' })
export class AccountAuth {
  @PrimaryColumn('uuid', { unique: true })
  authId: string

  @Column('uuid', { nullable: true })
  accountId: string

  @Column('citext')
  ip: string

  @Column('citext')
  email: string

  @Column('citext', { array: true })
  games: CallOfDuty.Game[]

  @Column('jsonb', { array: true })
  profiles: CallOfDuty.ProfileId.PlatformId[]

  @Column('jsonb')
  tokens: CallOfDuty.Tokens

  @Column()
  created: number
}

@Injectable()
export class AccountAuthDAO {
  constructor(
    @InjectRepository(AccountAuth, 'callofduty') public repo: Repository<AccountAuth>,
  ) {}
  private normalizeModel({ ip, accountId, games, profiles, tokens, email }:Partial<AccountAuth>) {
    const indexedProfiles:{[key:string]:CallOfDuty.ProfileId.PlatformId} = {}
    for(const { platform, username } of profiles) {
      indexedProfiles[`${platform}/${username}`] = { platform, username }
    }
    return {
      ip,
      email,
      accountId,
      games: () => `array[${[...new Set(games)].map(game => `'${game}'`).join(',')}]::citext[]`,
      tokens: () => `'${JSON.stringify(tokens)}'::jsonb`,
      profiles: () => `array[${Object.values(indexedProfiles).map(p => `'{"platform":"${p.platform}","username":"${p.username}"}'`)}]::jsonb[]`,
    }
  }
  private async _findOne(criteria:any) {
    const res = await this.repo.findOne(criteria)
    return Postgres.Denormalize.Model<AccountAuth>(res)
  }
  public async findById(authId:string):Promise<AccountAuth> {
    return this._findOne({ where: { authId } })
  }
  public async findByEmail(email:string):Promise<AccountAuth> {
    return this._findOne({ where: { email }, order: { created: -1 } })
  }
  public async findByAccountId(accountId:string):Promise<AccountAuth> {
    return this._findOne({ where: { accountId }, order: { created: -1 } })
  }
  public async insert(model:Partial<AccountAuth>):Promise<string> {
    await this.repo.createQueryBuilder()
      .insert()
      .into(AccountAuth)
      .values(this.normalizeModel(model))
      .execute()
    const { authId } = await this.findByEmail(model.email)
    return authId
  }
  public async update(model:Partial<AccountAuth>):Promise<UpdateResult> {
    const record = await this.findById(model.authId)
    return this.repo.createQueryBuilder()
      .update()
      .set(this.normalizeModel({ ...record, ...model }))
      .where({ authId: model.authId })
      .execute()
  }
}
