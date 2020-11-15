const objHash = require('object-hash')
import axios from 'axios'
import * as JWT from 'jsonwebtoken'
import { Assets, Schema, API } from 'callofduty'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import {
  Account,
  AccountDAO,
  AccountAuth,
  AccountAuthDAO,
  AccountProfile,
  AccountProfileDAO,
  AccountModel,
} from './entity'
import { JWT_SECRET, FAAS } from 'src/config'

@Injectable()
export class CallOfDutyAccountService {
  constructor(
    private readonly acctDao: AccountDAO,
    private readonly authDao: AccountAuthDAO,
    private readonly profileDao: AccountProfileDAO,
  ) {}
  public async fetchAll() {
    return this.acctDao.findAll()
  }
  public async findAllByUserId(userId:string) {
    return this.acctDao.findAllByUserId(userId)
  }
  public async newSignIn(
    ip:string,
    email:string,
    tokens:Schema.Tokens,
    games?:Schema.Game[],
    profiles?:Schema.ProfileId.PlatformId[],
    unoId?:string
  ) {
    let accountId:string
    const findByEmail = await this.authDao.findByEmail(email)
    if (findByEmail) {
      accountId = findByEmail.accountId
    }
    for(const { username, platform } of profiles) {
      if (!accountId) {
        const findByUsername = await this.profileDao.findByUsername(username, platform)
        if (findByUsername) {
          accountId = findByUsername.accountId
        }
      }
    }
    if (!accountId && unoId) {
      const findByUnoId = await this.acctDao.findByUnoId(unoId)
      if (findByUnoId) {
        accountId = findByUnoId.accountId
      }
    }
    const authId = await this.authDao.insert({ ip, accountId, email, tokens, games, profiles })
    if (!accountId) {
      return { authId, unoId, email, tokens, games, profiles }
    }
    return this.buildModelForAccountId(accountId)
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
    const acct = await this.acctDao.findByUnoId(unoId)
    if (!acct) {
      return null
    }
    return this.buildModelForAccountId(acct.accountId)
  }
  public async buildModelForProfile(username:string, platform:Schema.Platform):Promise<AccountModel> {
    const profileRecord = await this.profileDao.findByUsername(username, platform)
    if (!profileRecord) {
      return null
    }
    return this.buildModelForAccountId(profileRecord.accountId)
  }
  public async buildModelForAccountId(accountId:string):Promise<AccountModel> {
    const { userId, unoId } = await this.acctDao.findById(accountId)
    const { authId, profiles, games, email, tokens } = await this.authDao.findByAccountId(accountId)
    return { userId, unoId, authId, profiles, games, email, tokens, accountId }
  }
  public async insertProfileForAccountId(accountId:string, username:string, platform:Schema.Platform, games:Schema.Game[]) {
    const profileParmas = { accountId, username, platform, games }
    const hashId = `${accountId}.${objHash(profileParmas)}`
    await this.profileDao.insert({ hashId, ...profileParmas })
  }
  public async deleteProfileForAccountId(accountId:string, username:string, platform:Schema.Platform) {
    const profile = await this.profileDao.findByUsername(username, platform)
    if (!profile || profile.accountId !== accountId) {
      throw 'invalid account'
    }
    await this.profileDao.deleteById(profile.hashId)
  }
  public async saveUnoIdProfile(unoId:string, game:Schema.Game, username?:string, platform?:Schema.Platform) {
    let account = await this.acctDao.findByUnoId(unoId)
    if (!account) {
      await this.acctDao.insert({ unoId })
      account = await this.acctDao.findByUnoId(unoId)
    }
    const { accountId } = account
    if (game && username && platform) {
      const found = await this.profileDao.findByUsername(username, platform)
      if (!found || found.accountId !== accountId) {
        await this.profileDao.insert({ accountId, username, platform, games: [game] })
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
    const authRecord = await this.authDao.findById(authId)
    if (!authRecord) {
      throw new InternalServerErrorException(`invalid authId ${authId}`)
    }
    const { games, profiles, email, tokens } = authRecord
    await this.acctDao.insert({ userId, unoId })
    const [acct] = await this.acctDao.findAllByUserId(userId)
    const { accountId } = acct
    await this.authDao.update({ ...authRecord, accountId })
    for(const { username, platform } of profiles) {
      await this.insertProfileForAccountId(accountId, username, platform, games)
    }
    if (etl) {
      await this.triggerETL(accountId)
    }
    return this.buildModelForAccountId(accountId)
  }
}
