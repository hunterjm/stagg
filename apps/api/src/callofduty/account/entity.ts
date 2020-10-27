import * as COD from '@stagg/callofduty'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { InsertResult, Repository, UpdateResult } from 'typeorm'
import { Entity, Column, PrimaryColumn, Index } from 'typeorm'
import { Postgres } from 'src/util'

@Entity({ name: 'accounts', database: 'callofduty' })
export class Account {
  @PrimaryColumn('uuid')
  @Index({ unique: true })
  accountId: string
  
  @Column('uuid', { nullable: true })
  userId: string
  
  @Column('text', { nullable: true })
  unoId: Account.Schema.UnoID

  @Column('citext')
  origin: Account.Schema.Origin

  @Column('citext')
  access: Account.Schema.Access

  @Column('jsonb', { array: true, nullable: true })
  auth: Account.Schema.AuthTokens[]

  @Column('citext', { array: true, nullable: true })
  emails: string[]

  @Column('citext', { array: true })
  games: COD.Schema.API.Game[]

  @Column('jsonb', { array: true })
  profiles: Account.Schema.ProfileId[]

  @Column()
  created: number
}

@Injectable()
export class AccountDAO {
  constructor(
    @InjectRepository(Account, 'callofduty') private acctRepo: Repository<Account>,
  ) {}
  private normalizeModel({ userId, games, profiles, origin, access, unoId='', auth=[], emails=[] }:Partial<Account>) {
    const indexedProfiles:{[key:string]:Account.Schema.ProfileId} = {}
    for(const { platform, username } of profiles) {
      indexedProfiles[`${platform}/${username}`] = { platform, username }
    }
    return {
      userId,
      unoId,
      origin,
      access,
      games: () => `array[${[...new Set(games)].map(game => `'${game}'`).join(',')}]::citext[]`,
      emails: () => `array[${[...new Set(emails)].map(email => `'${email}'`).join(',')}]::citext[]`,
      auth: () => `array[${auth.map(t => `'{"xsrf":"${t.xsrf}","sso":"${t.sso}","atkn":"${t.atkn}"}'`)}]::jsonb[]`,
      profiles: () => `array[${Object.values(indexedProfiles).map(p => `'{"platform":"${p.platform}","username":"${p.username}"}'`)}]::jsonb[]`,
    }
  }
  public async insert(acct:Partial<Account>):Promise<InsertResult> {
    return this.acctRepo.createQueryBuilder()
      .insert()
      .into(Account)
      .values(this.normalizeModel(acct))
      .execute()
  }
  public async update(acct:Account):Promise<UpdateResult> {
    return this.acctRepo.createQueryBuilder()
      .update()
      .set(this.normalizeModel(acct))
      .where({ accountId: acct.accountId })
      .execute()
  }
  public async findById(accountId:string):Promise<Account> {
      const acct = await this.acctRepo.findOne(accountId)
      if (!acct) {
        return null
      }
      return Postgres.Denormalize.Model<Account>(acct)
  }
  public async findAllByUserId(userId:string):Promise<Account[]> {
      const accts = await this.acctRepo.find({ where: { userId } })
      if (!accts || !accts.length) {
        return []
      }
      return accts.map(acct => Postgres.Denormalize.Model<Account>(acct))
  }
  public async findByUnoId(unoId:string):Promise<Account> {
      const acct = await this.acctRepo.findOne({ where: { unoId } })
      if (!acct) {
        return null
      }
      return Postgres.Denormalize.Model<Account>(acct)
  }
  public async findByEmail(email:string):Promise<Account> {
    const lookup = await this.acctRepo.findOne({ where: `'${email}' = ANY(emails)` })
    return Postgres.Denormalize.Model<Account>(lookup)
  }
  public async findByProfile(username:string, platform:COD.Schema.API.Platform):Promise<Account> {
      const acct = await this.acctRepo.findOne({ where: `'${JSON.stringify({ username, platform })}' = ANY(profiles)` })
      if (!acct) {
          return null
      }
      return Postgres.Denormalize.Model<Account>(acct)
  }
}
export namespace Account {
  export namespace Schema {
    export type UnoID = string
    export type Access = 'public' | 'protected' | 'private'
    export type Origin = 'self' | 'kgp' | 'friend' | 'enemy' | 'inquiry'
    export type AuthTokens = { sso: string, xsrf: string, atkn: string }
    export type ProfileId = { username: string, platform: COD.Schema.API.Platform }
  }
}



@Entity({ name: 'accounts/auth', database: 'callofduty' })
export class AccountAuth {
  @PrimaryColumn('uuid')
  @Index({ unique: true })
  id: string

  @Column('citext')
  email: string

  @Column('citext', { array: true })
  games: COD.Schema.API.Game[]

  @Column('jsonb', { array: true })
  profiles: Account.Schema.ProfileId[]

  @Column('jsonb')
  auth: Account.Schema.AuthTokens

  @Column()
  created: number
}

@Injectable()
export class AccountAuthDAO {
  constructor(
    @InjectRepository(AccountAuth, 'callofduty') private authRepo: Repository<AccountAuth>,
  ) {}
  private normalizeModel({ games, profiles, auth, email }:Partial<AccountAuth>) {
    const indexedProfiles:{[key:string]:Account.Schema.ProfileId} = {}
    for(const { platform, username } of profiles) {
      indexedProfiles[`${platform}/${username}`] = { platform, username }
    }
    return {
      email,
      games: () => `array[${[...new Set(games)].map(game => `'${game}'`).join(',')}]::citext[]`,
      auth: () => `'${JSON.stringify(auth)}'::jsonb`,
      profiles: () => `array[${Object.values(indexedProfiles).map(p => `'{"platform":"${p.platform}","username":"${p.username}"}'`)}]::jsonb[]`,
    }
  }
  public async insert(auth:Partial<AccountAuth>):Promise<string> {
    await this.authRepo.createQueryBuilder()
      .insert()
      .into(AccountAuth)
      .values(this.normalizeModel(auth))
      .execute()
    const { id } = await this.authRepo.findOne({ where: { email: auth.email }, order: { created: 1 } })
    return id
  }
}
