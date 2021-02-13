import axios from 'axios'
import * as qs from 'querystring'
import { Injectable } from '@nestjs/common'
import {
  CONFIG,
  SECRETS,
} from 'src/config'

@Injectable()
export class DiscordService {
  constructor() {}
  public async exchangeAccessTokenForAccount(accessToken:string):Promise<{ id:string, tag:string, avatar:string }> {
    const { data: { id, avatar, username, discriminator } } = await axios.get(CONFIG.HOST_DISCORD_OAUTH_IDENTIFY, { headers: { 'Authorization': `Bearer ${accessToken}` } })
    return { id, tag: `${username}#${discriminator}`, avatar }
  }
  public async exchangeOAuthCodeForAccessToken(accessCode:string):Promise<string> {
    try {
      const { data: { access_token } } = await axios.post(CONFIG.HOST_DISCORD_OAUTH_EXCHANGE, qs.stringify({
        code: accessCode,
        scope: CONFIG.DISCORD_OAUTH_SCOPE,
        grant_type: 'authorization_code',
        redirect_uri: CONFIG.HOST_DISCORD_OAUTH_REDIRECT,
        client_id: CONFIG.DISCORD_CLIENT_ID,
        client_secret: SECRETS.DISCORD,
      }))
      return access_token
    } catch(e) {
      console.log(e)
      return null
    }
  }
}
