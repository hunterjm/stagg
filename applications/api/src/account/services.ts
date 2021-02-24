import { Account } from '@stagg/db'
import { Tokens, PlatformId, Platform } from '@callofduty/types'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Model } from '@stagg/api'

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account.Entity, 'stagg') private readonly repo: Account.Repository,
  ) {}
  public async findAny(platform:Platform|'id'|'discord'|'account', id:string):Promise<Account.Entity> {
    let criteria = <{[key:string]:string}>{}
    switch(platform) {
      case 'id':
        criteria = { callofduty_uno_id: id }
        break
      case 'discord':
        criteria = { discord_id: id }
        break
      case 'account':
        criteria = { account_id: id }
        break
      default:
        criteria = { [`callofduty_${platform}_username`]: id }
    }
    return this.repo.findOne(criteria)
  }
  public async getById(account_id:string):Promise<Account.Entity> {
    return this.repo.findOne({ account_id })
  }
  public async getByDiscordId(discord_id:string):Promise<Account.Entity> {
    return this.repo.findOne({ discord_id })
  }
  public async getByPlatformId({ platform, username }:PlatformId):Promise<Account.Entity> {
    const field = `callofduty_${platform}_username`
    return this.repo.findOne({ [field]: username })
  }
  public async createFromProvisions(discord:Model.Account.Discord, callofduty:Model.Account.CallOfDuty, authorization:Tokens) {
    let unoUsername:string, xblUsername:string, psnUsername:string, battleUsername:string
    for(const profile of callofduty.profiles) {
      switch(profile.platform) {
        case 'uno':
          unoUsername = profile.username
          break
        case 'xbl':
          xblUsername = profile.username
          break
        case 'psn':
          psnUsername = profile.username
          break
        case 'battle':
        default:
          battleUsername = profile.username
          break
      }
    }
    const freeDays = 30
    const subscriptionEnd = new Date()
    subscriptionEnd.setTime(subscriptionEnd.getTime() + freeDays * 24 * 60 * 60 * 1000)
    const createdAcct = await this.repo.save({
      discord_id: discord.id,
      discord_tag: discord.tag,
      discord_avatar: discord.avatar,
      callofduty_games: callofduty.games,
      callofduty_uno_id: callofduty.unoId,
      callofduty_uno_username: unoUsername,
      callofduty_xbl_username: xblUsername,
      callofduty_psn_username: psnUsername,
      callofduty_battle_username: battleUsername,
      callofduty_authorization_tokens: authorization,
      subscription_expiration_datetime: subscriptionEnd,
    } as any)
    return createdAcct
  }
}
