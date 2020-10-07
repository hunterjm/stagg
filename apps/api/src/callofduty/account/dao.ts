import { Schema } from '@stagg/callofduty'
import { Postgres } from '@stagg/util'
import { InsertResult, Repository, UpdateResult, In } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'
import { Account, AccountLookup, ProfileIdentifier } from 'src/callofduty/account/entity'

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
    const parsedAcct = await this.findByUnoId(unoId)
    parsedAcct.auth.push(tokens)
    return this.acctRepository.save(parsedAcct)
  }
}

@Injectable()
export class AccountLookupDAO {
  constructor(
    // @InjectRepository(Account) private acctRepository: Repository<Account>,
    @InjectRepository(AccountLookup) private lookupRepository: Repository<AccountLookup>,
  ) {}
  public async insert(unoId:string, emails:string[], games:Schema.API.Game[], profiles:ProfileIdentifier[]):Promise<InsertResult> {
    return this.lookupRepository.createQueryBuilder()
    .insert()
    .into(AccountLookup)
    .values({
      unoId,
      games: () => `array[${games.map(game => `'${game}'::citext`).join(',')}]`,
      emails: () => `array[${emails.map(email => `'${email}'::citext`).join(',')}]`,
      profiles: () => `array[${profiles.map(p => `'{"platform":"${p.platform}","username":"${p.username}"}'::jsonb`)}]`,
    }).execute()
  }
  public async findByUnoId(unoId:string):Promise<AccountLookup> {
    const lookup = await this.lookupRepository.findOne(unoId)
    if (!lookup) {
        throw `Account lookup missing for ${unoId}`
    }
    console.log('Raw lookup', lookup)
    return Postgres.Denormalize.Model<AccountLookup>(lookup)
  }
  public async findByEmail(email:string):Promise<AccountLookup> {
    const lookup = await this.lookupRepository.findOne({ where: `'${email}' = ANY(emails)` })
    if (!lookup) {
        throw `Account lookup missing for ${email}`
    }
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
    console.log(propName, typeof lookup[propName], Array.isArray(lookup[propName]), lookup[propName])
    lookup[propName].push(propValue)
    const normalized = Postgres.Normalize.Model<AccountLookup>({...lookup})
    console.log('Saving:', normalized)
    await this.lookupRepository.createQueryBuilder()
    .update()
    .set({
        unoId,
        games: () => `${normalized.games}::citext[]` as any,
        emails: () => `${normalized.emails}::citext[]` as any,
        profiles: () => `${normalized.profiles}::jsonb[]` as any,
    }).where({ unoId }).execute()
    return lookup
    // return this.lookupRepository.save(Postgres.Normalize.Model<AccountLookup>(lookup))
  }
}

