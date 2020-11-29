const objHash = require('object-hash')
import axios from 'axios'
import * as JWT from 'jsonwebtoken'
import { Assets, Schema, API } from 'callofduty'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { JWT_SECRET, FAAS } from 'src/config'
import { CallOfDuty } from '@stagg/db'
import { AccountModel } from './dto'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class CallOfDutyAccountService {
  constructor(
    @InjectRepository(CallOfDuty.Account.Base.Repository, 'callofduty') 
    private readonly acctRepo: CallOfDuty.Account.Base.Repository,
    @InjectRepository(CallOfDuty.Account.Auth.Repository, 'callofduty') 
    private readonly authRepo: CallOfDuty.Account.Auth.Repository,
    @InjectRepository(CallOfDuty.Account.Profile.Repository, 'callofduty') 
    private readonly profileRepo: CallOfDuty.Account.Profile.Repository,
  ) {}
  public async fetchAll() {
    return this.acctRepo.findAll()
  }
  public async findAllByUserId(userId:string) {
    return this.acctRepo.findAllByUserId(userId)
  }
  public async newSignIn(
    ip:string,
    email:string,
    tokens:Schema.Tokens,
    games?:Schema.Game[],
    profiles?:Schema.ProfileId.PlatformId[],
    unoId?:string
  ) {
    let account:CallOfDuty.Account.Base.Entity
    const findByEmail = await this.authRepo.findByEmail(email)
    if (findByEmail) {
      account = findByEmail.account
    }
    for(const { username, platform } of profiles) {
      if (!account) {
        const findByUsername = await this.profileRepo.findByUsernamePlatform(username, platform)
        if (findByUsername) {
          account = findByUsername.account
        }
      }
    }
    if (!account && unoId) {
      const findByUnoId = await this.acctRepo.findOneByUnoId(unoId)
      if (findByUnoId) {
        account = findByUnoId
      }
    }
    const authId = await this.authRepo.insertAuth({ ip, account, email, tokens, games, profiles })
    if (!account) {
      return { authId, unoId, email, tokens, games, profiles }
    }
    return this.buildModelForAccountId(account.accountId)
  }
  public async authorizationExchange(
    email:string,
    password:string,
    fetchIdentity:boolean=true,
    fetchAccounts:boolean=true,
    fetchUnoId:boolean=true,
  ) {
    let unoId:string
    let games:Schema.Game[] = []
    let profiles:Schema.ProfileId.PlatformId[] = []
    const api = new API()
    const tokens = await api.Authorize(email, password) // will throw if fail
    if (fetchIdentity) {
      const { titleIdentities } = await api.Identity()
      if (!titleIdentities.length) {
        throw 'fetchIdentity returned empty'
      }
      for(const { title, platform, username } of titleIdentities) {
        if (!games.includes(title)) {
          games.push(title)
        }
        if (!profiles.filter(p => p.username === username && p.platform === platform).length) {
          profiles.push({ platform, username })
        }
      }
    }
    if (fetchAccounts) {
      if (!fetchIdentity) {
        throw 'fetchIdentity required for fetchAccounts'
      }
      const { username, platform } = profiles[0]
      const accounts = await api.Accounts({ username, platform })
      for(const pId in accounts) {
        const platform = <Schema.Platform>pId
        const { username } = accounts[platform]
        if (!profiles.filter(p => p.username === username && p.platform === platform).length) {
          profiles.push({ platform, username })
        }
      }
    }
    if (fetchUnoId) {
      if (!fetchIdentity) {
        throw 'fetchIdentity required for fetchUnoId'
      }
      if (!games.includes('mw')) {
        throw `unoId only available in ${Assets.Games['mw'].name}`
      }
      const { username, platform } = profiles[0]
      const { matches: [firstMpMatch] } = await api.MatchHistory({ username, platform }, 'mp', 'mw', 0, 1)
      if (firstMpMatch) {
        unoId = firstMpMatch.player.uno
      } else {
        const { matches: [firstWzMatch] } = await api.MatchHistory({ username, platform }, 'wz', 'mw', 0, 1)
        if (!firstWzMatch) {
          throw `no matches found for "${platform}/${username}" in ${Assets.Games['mw'].name} ${Assets.GameTypes['mp'].name} or ${Assets.GameTypes['wz'].name}`
        }
        unoId = firstWzMatch.player.uno
      }
    }
    return { email, tokens, games, profiles, unoId }
  }
  public sanitizeModel(model:AccountModel) {
    delete model.tokens
    delete model.email
    delete model.authId
    return model
  }
  public async buildModelForUnoId(unoId:string):Promise<AccountModel> {
    const acct = await this.acctRepo.findOneByUnoId(unoId)
    if (!acct) {
      return null
    }
    return this.buildModelForAccountId(acct.accountId)
  }
  public async buildModelForProfile(username:string, platform:Schema.Platform):Promise<AccountModel> {
    const profileRecord = await this.profileRepo.findByUsernamePlatform(username, platform)
    if (!profileRecord) {
      return null
    }
    return this.buildModelForAccountId(profileRecord.account.accountId)
  }
  public async buildModelForAccountId(accountId):Promise<AccountModel> {
    const { userId, unoId } = await this.acctRepo.findOneOrFail(accountId)
    const { authId, profiles, games, email, tokens } = await this.authRepo.findByAccountId(accountId)
    return { userId, unoId, authId, profiles, games, email, tokens, accountId }
  }
  public async insertProfileForAccountId(accountId:string, username:string, platform:Schema.Platform, games:Schema.Game[]) {
    const account = await this.acctRepo.findOneOrFail(accountId)
    await this.profileRepo.insertProfile({ account, username, platform, games })
  }
  public async deleteProfileForAccountId(accountId:string, username:string, platform:Schema.Platform) {
    const profile = await this.profileRepo.findByUsernamePlatform(username, platform)
    if (!profile || profile.account.accountId !== accountId) {
      throw 'invalid account'
    }
    await this.profileRepo.deleteForAccountId(accountId, username, platform)
  }
  public async saveUnoIdProfile(unoId:string, game:Schema.Game, username?:string, platform?:Schema.Platform) {
    let account = await this.acctRepo.findOneByUnoId(unoId)
    if (!account) {
      account = await this.acctRepo.insertAccount({ unoId })
    }
    if (game && username && platform) {
      const found = await this.profileRepo.findByUsernamePlatform(username, platform)
      if (!found || found.account !== account) {
        await this.profileRepo.insertProfile({ account, username, platform, games: [game] })
      }
    }
  }
  public async triggerETL(accountId:string) {
    const acctModel = await this.buildModelForAccountId(accountId)
    const authTokens = acctModel.tokens
    const integrityJwt = JWT.sign(acctModel, JWT_SECRET)
    const { username, platform } = acctModel.profiles[0]
    for(const gameId of acctModel.games) {
      if (gameId === 'bo4') {
          continue // havent normalized this yet
      }
      for(const gameType of Object.keys(Assets.GameTypes)) {
          const payload = {
              gameId,
              gameType,
              username,
              platform,
              authTokens,
              startTime: 0,
          }
          console.log(`[>] Kicking off ETL for ${gameId}/${gameType}/${username}/${platform}`)//, FAAS.ETL_COD, payload, { headers: { 'x-integrity-jwt': integrityJwt } })
          axios.post(FAAS.ETL_COD, payload, { headers: { 'x-integrity-jwt': integrityJwt } }).catch(e => console.log('[!] ETL Failure:', e?.response?.data?.error || e))
      }
    }
  }
  public async createAccountForUser(userId:string, authId:string, unoId:string='', etl:boolean=true) {
    const authRecord = await this.authRepo.findOne(authId)
    if (!authRecord) {
      throw new InternalServerErrorException(`invalid authId ${authId}`)
    }
    const { games, profiles } = authRecord
    const account = await this.acctRepo.insertAccount({ userId, unoId })
    await this.authRepo.updateAuth({ ...authRecord, account })
    for(const { username, platform } of profiles) {
      await this.insertProfileForAccountId(account.accountId, username, platform, games)
    }
    if (etl) {
      await this.triggerETL(account.accountId)
    }
    return this.buildModelForAccountId(account.accountId)
  }
}
