import { Schema } from '@stagg/callofduty'
import { InsertResult, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'
import { Account, AccountLookup, ProfileIdentifier } from 'src/callofduty/account/entity'
import { Postgres } from 'src/util'

@Injectable()
export class AccountDAO {
  constructor(
    @InjectRepository(Account) private acctRepository: Repository<Account>,
  ) {}
  public async insert(unoId:string, { atkn, xsrf, sso }:Schema.API.Tokens, access:'public'='public'):Promise<InsertResult> {
    return this.acctRepository.createQueryBuilder()
    .insert()
    .into(Account)
    .values({
      unoId,
      access,
      auth: () => `array['{"sso":"${sso}","xsrf":"${xsrf}","atkn":"${atkn}"}'::jsonb]`,
    }).execute()
  }
  public async findByUnoId(unoId:string):Promise<Account> {
      const acct = await this.acctRepository.findOne(unoId)
      if (!acct) {
          throw `Account missing for ${unoId}`
      }
      return Postgres.Denormalize.Model<Account>(acct)
  }
  public async addAuth(unoId:string, tokens:Schema.API.Tokens):Promise<Account> {
    const account = await this.findByUnoId(unoId)
    account.auth.push(tokens)
    const normalized = Postgres.Normalize.Model<Account>({...account})
    await this.acctRepository.createQueryBuilder()
        .update()
        .set({
            unoId,
            auth: () => `${normalized.auth}::jsonb[]` as any,
        }).where({ unoId }).execute()
    return account
  }
}

@Injectable()
export class AccountLookupDAO {
  constructor(
    @InjectRepository(AccountLookup) private lookupRepository: Repository<AccountLookup>,
  ) {}
  public async insert(unoId:string, emails:string[], games:Schema.API.Game[], profiles:ProfileIdentifier[]):Promise<InsertResult> {
    const profileMap = {} as any
    for(const profile of profiles) {
        profileMap[profile.platform] = profile.username
    }
    const uniqueProfiles = Object.keys(profileMap).map(platform => ({ platform, username: profileMap[platform] }))
    return this.lookupRepository.createQueryBuilder()
    .insert()
    .into(AccountLookup)
    .values({
        unoId,
        games: () => `array[${[...new Set(games)].map(game => `'${game}'`).join(',')}]::citext[]`,
        emails: () => `array[${[...new Set(emails)].map(email => `'${email}'`).join(',')}]::citext[]`,
        profiles: () => `array[${uniqueProfiles.map(p => `'{"platform":"${p.platform}","username":"${p.username}"}'`)}]::jsonb[]`,
    }).execute()
  }
  public async findByUnoId(unoId:string):Promise<AccountLookup> {
    const lookup = await this.lookupRepository.findOne(unoId)
    return Postgres.Denormalize.Model<AccountLookup>(lookup)
  }
  public async findByEmail(email:string):Promise<AccountLookup> {
    const lookup = await this.lookupRepository.findOne({ where: `'${email}' = ANY(emails)` })
    return Postgres.Denormalize.Model<AccountLookup>(lookup)
  }
  public async addGame(unoId:string, game:Schema.API.Game):Promise<AccountLookup> {
      return this.addProp(unoId, 'games', game)
  }
  public async addEmail(unoId:string, email:string):Promise<AccountLookup> {
      return this.addProp(unoId, 'emails', email)
  }
  public async addProfile(unoId:string, profile:ProfileIdentifier):Promise<AccountLookup> {
      return this.addProp(unoId, 'profiles', profile)
  }
  public async addProp(unoId:string, propName:string, propValue:any):Promise<AccountLookup> {
    const lookup = await this.findByUnoId(unoId)
    if (!lookup) {
        throw `Account lookup missing for ${unoId}`
    }
    if (propName === 'profiles') {
        const match = lookup.profiles.find(p => p.platform.toLowerCase() === propValue.platform.toLowerCase() && p.username.toLowerCase() === propValue.username.toLowerCase())
        if (match) {
            return lookup
        }
        lookup.profiles.push(propValue)
    } else {
        if (lookup[propName].includes(propValue)) {
            return lookup
        }
        lookup[propName].push(propValue)
    }
    const normalized = Postgres.Normalize.Model<AccountLookup>({...lookup})
    await this.lookupRepository.createQueryBuilder()
        .update()
        .set({
            unoId,
            games: () => `${normalized.games}::citext[]` as any,
            emails: () => `${normalized.emails}::citext[]` as any,
            profiles: () => `${normalized.profiles}::jsonb[]` as any,
        }).where({ unoId }).execute()
    return lookup
  }
}

