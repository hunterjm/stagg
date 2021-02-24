import axios from 'axios'
import * as qs from 'querystring'
import { Injectable } from '@nestjs/common'
import { config } from 'src/config'

@Injectable()
export class DiscordService {
  constructor() {}
  public async exchangeAccessTokenForAccount(accessToken:string):Promise<{ id:string, tag:string, avatar:string }> {
    const { data: { id, avatar, username, discriminator } } = await axios.get(config.network.host.discord.oauth.identify, { headers: { 'Authorization': `Bearer ${accessToken}` } })
    return { id, tag: `${username}#${discriminator}`, avatar }
  }
  public async exchangeOAuthCodeForAccessToken(accessCode:string):Promise<string> {
    try {
      const { data: { access_token } } = await axios.post(config.network.host.discord.oauth.exchange, qs.stringify({
        code: accessCode,
        scope: config.discord.client.scope,
        grant_type: 'authorization_code',
        redirect_uri: config.network.host.discord.oauth.redirect,
        client_id: config.discord.client.id,
        client_secret: config.discord.client.secret,
      }))
      return access_token
    } catch(e) {
      console.log(e)
      return null
    }
  }
}
