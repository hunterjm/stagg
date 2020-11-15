import axios from 'axios'
import * as qs from 'querystring'
import { BadGatewayException, Injectable } from '@nestjs/common'
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
  public async findByUserId(userId:string) {
    return this.acctDao.findByUserId(userId)
  }
  public async exchangeAccessCode(accessCode:string):Promise<DiscordAuthorizationJWT> {
    let id:string, tag:string, avatar:string, username:string, accessToken:string, refreshToken:string
    const payload = {
      code: accessCode,
      scope: DISCORD.OAUTH.SCOPE,
      grant_type: 'authorization_code',
      redirect_uri: DISCORD.OAUTH.REDIRECT,
      client_id: DISCORD.CLIENT.ID,
      client_secret: DISCORD.CLIENT.SECRET,
    }
    try {
      const { data } = await axios.post(DISCORD.OAUTH.HOST.EXCHANGE, qs.stringify(payload))
      accessToken = data.access_token
      refreshToken = data.refresh_token
    } catch(e) {
      console.log('[!] Discord access code exchange failure:')
      console.log('    HOST', DISCORD.OAUTH.HOST.EXCHANGE)
      console.log('    PAYLOAD', payload)
      console.log('    QUERYSTRING', qs.stringify(payload))
      console.log('    ORIGINAL ERROR', e)
      throw new BadGatewayException(`Discord access code exchange failure`)
    }
    try {
      const { data } = await axios.get(DISCORD.OAUTH.HOST.IDENTIFY, { headers: { 'Authorization': `Bearer ${accessToken}` } })
      id = data.id
      avatar = data.avatar
      username = data.username
      tag = `${data.username}#${data.discriminator}`
    } catch(e) {
      console.log('[!] Discord access token exchange failure:', e)
      throw new BadGatewayException(`Discord access token exchange failure`)
    }
    return {
      id,
      tag,
      avatar,
      accessToken,
      refreshToken,
    }
  }
}
