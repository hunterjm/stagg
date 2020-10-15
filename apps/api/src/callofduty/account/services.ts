import { Schema, Normalize } from '@stagg/callofduty'
import { Connection, Types } from 'mongoose'
import { InjectConnection } from '@nestjs/mongoose'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { Account as AcctSchema } from 'src/callofduty/account/schemas'

@Injectable()
export class CallOfDutyAccountService {
  constructor(
    @InjectConnection('stagg') private db_stg: Connection,
    @InjectConnection('callofduty') private db_cod: Connection,
  ) {}
  public async getAccountById(accountId:string):Promise<AcctSchema> {
    return this.db_cod.collection('accounts').findOne({ _id: Types.ObjectId(accountId) })
  }
  public async getAccountByEmail(email:string):Promise<AcctSchema> {
    return this.db_cod.collection('accounts').findOne({ email })
  }
  public async getAccountByPlatformUsername(platform:Schema.API.Platform, username:string):Promise<AcctSchema> {
    return this.db_cod.collection('accounts').findOne({ [`profiles.${platform}`]: username })
  }
  public async getAccountByUserId(userId:string):Promise<AcctSchema> {
    const user = await this.db_stg.collection('users').findOne({ _id: Types.ObjectId(userId) })
    return this.getAccountById(user?.accounts?.callofduty)
  }
  public async getRandomAuthTokens():Promise<{ atkn: string, sso: string, xsrf: string }> {
    const tokens = await this.db_cod.collection('accounts').find({ 'auth.atkn': { $exists: true } }, { auth: 1 } as any).toArray()
    return tokens[Math.floor(Math.random() * Math.floor(tokens.length))].auth
  }
  public async getMatchRecordCountsForAccount(account:Partial<AcctSchema>):Promise<{ [key:string]: { mp: number, wz: number } }> {
    const counts = {}
    for(const game of account.games) {
      try {
        counts[game] = {
          mp: await this.db_cod.collection(`${game}.mp.match.records`).estimatedDocumentCount({ _account: account._id }),
          wz: await this.db_cod.collection(`${game}.wz.match.records`).estimatedDocumentCount({ _account: account._id }),
        }
      } catch(e) {}
    }
    return counts
  }
  public async getProfileDiff(platform:Schema.API.Platform, username:string) {
    const acct = await this.getAccountByPlatformUsername(platform, username)
        let { auth } = acct
        if (!acct) {
            auth = await this.getRandomAuthTokens()
        }
        if (!auth) {
            throw new InternalServerErrorException('something went wrong')
        }
        const matchCounts = await this.getMatchRecordCountsForAccount(acct)
        const account = !acct ? {} : {
            _id: acct?._id,
            games: acct?.games,
            profiles: acct?.profiles,
            matches: matchCounts,
        }
        const apiMatchCounts = {}
        const gameProfileData = {}
        for(const game of account?.games) {
            try { gameProfileData[game] = await this.db_cod.collection(`${game}.mp.profiles`).findOne({ _account: acct._id }) } catch(e) {}
            apiMatchCounts[game] = gameProfileData[game]?.total?.games || 0
        }
        return {
            account,
            profile: { matches: apiMatchCounts },
        }
  }
  public async searchAccount(
    platform:Schema.API.Platform,
    username:string,
    game?:Schema.API.Game
  ):Promise<{ username: string, platform: Schema.API.Platform }[]> {
    const queries = []
    const gameQuery = game ? { games: game } : {}
    if (platform) {
        queries.push({ ...gameQuery, [`profiles.${platform.toLowerCase()}`]: { $regex: username, $options: 'i' } })
    } else {
        for(const p in Normalize.Platforms) {
            queries.push({ ...gameQuery, [`profiles.${p}`]: { $regex: username, $options: 'i' } })
        }
    }
    const accounts = await this.db_cod.collection('accounts').find({ $or: queries }).toArray()
    if (!accounts || !accounts.length) {
        return []
    }
    const results = []
    for(const acct of accounts) {
        for(const platform in acct.profiles) {
          const uname = acct.profiles[platform]
          if (uname.toLowerCase().includes(username.toLowerCase())) {
            results.push({ username: acct.profiles[platform], platform })
          }
        }
    }
    return results
  }
}
