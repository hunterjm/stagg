import axios from 'axios'
import * as qs from 'querystring'
import { Injectable } from '@nestjs/common'
import { Account, AccountDAO } from 'src/discord/entity'
import { DISCORD } from 'src/config'

export interface DiscordAuthorizationJWT {
  id:string
  tag:string
  avatar:string
  accessToken:string
  refreshToken:string
}

@Injectable()
export class DiscordService {
  constructor(
    private readonly acctDao: AccountDAO,
  ) {}
  public async createAccount(userId:string, discordId:string, tag:string, avatar:string):Promise<Account> {
    await this.acctDao.insert({ userId, discordId, tag, avatar })
    return this.acctDao.findById(discordId)
  }
  public async findById(discordId:string) {
    return this.acctDao.findById(discordId)
  }
  public async exchangeAccessToken(accessToken:string):Promise<DiscordAuthorizationJWT> {
    const payload = {
      code: accessToken,
      scope: DISCORD.OAUTH.SCOPE,
      grant_type: 'authorization_code',
      redirect_uri: DISCORD.OAUTH.REDIRECT,
      client_id: DISCORD.CLIENT.ID,
      client_secret: DISCORD.CLIENT.SECRET,
    }
    try {
      console.log('[>] Exchanging Discord token...')
      console.log('    POST', DISCORD.OAUTH.HOST.EXCHANGE)
      console.log('    PAYLOAD', payload)
      console.log('    QUERYSTRING', qs.stringify(payload))
      const { data: { access_token, refresh_token } } = await axios.post(DISCORD.OAUTH.HOST.EXCHANGE, qs.stringify(payload))
      console.log('    Got access token', access_token)
      const { data: { id, username, discriminator, avatar } } = await axios.get(DISCORD.OAUTH.HOST.IDENTIFY, { headers: { 'Authorization': `Bearer ${access_token}` } })
      console.log('    Got id', id)
      return {
        id,
        avatar,
        accessToken: access_token,
        refreshToken: refresh_token,
        tag: `${username}#${discriminator}`,
      }
    } catch(e) {
      console.log('failed', e)
    }
  }
}
