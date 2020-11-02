import axios from 'axios'
import * as qs from 'querystring'
import { Injectable } from '@nestjs/common'
import { Account, AccountDAO } from 'src/discord/entity'
import { DISCORD } from 'src/config'

@Injectable()
export class DiscordService {
  constructor(
    private readonly acctDao: AccountDAO,
  ) {}
  public async createAccount(userId:string, discordId:string, tag:string, avatar:string):Promise<Account> {
    await this.acctDao.insert({ userId, discordId, tag, avatar })
    return this.acctDao.findById(discordId)
  }
  public async exchangeAccessToken(accessToken:string) {
    const payload = {
      code: accessToken,
      scope: DISCORD.OAUTH.SCOPE,
      grant_type: 'authorization_code',
      redirect_uri: DISCORD.OAUTH.REDIRECT,
      client_id: DISCORD.CLIENT.ID,
      client_secret: DISCORD.CLIENT.SECRET,
    }
    const { data: { access_token, refresh_token } } = await axios.post(DISCORD.OAUTH.HOST.EXCHANGE, qs.stringify(payload))
    const { data: { id, username, discriminator, avatar } } = await axios.get(DISCORD.OAUTH.HOST.IDENTIFY, { headers: { 'Authorization': `Bearer ${access_token}` } })
    return {
      id,
      avatar,
      accessToken: access_token,
      refreshToken: refresh_token,
      tag: `${username}#${discriminator}`,
    }
  }
}
