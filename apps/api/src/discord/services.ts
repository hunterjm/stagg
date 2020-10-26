import axios from 'axios'
import * as qs from 'querystring'
import * as Discord from 'discord.js'
import { Injectable } from '@nestjs/common'
import { User } from 'src/user/schemas'
import { UserService } from 'src/user/services'
import { Dispatch } from 'src/discord/bot/services.dispatch'
import { formatOutput, Output } from 'src/discord/bot/util'
import { DiscordBotDispatchService } from 'src/discord/bot/services.dispatch'
import { DISCORD } from 'src/config'

@Injectable()
export class DiscordService {
  public readonly client = new Discord.Client()
  constructor(
    private readonly dispatchService: DiscordBotDispatchService
  ) {
    this.client.login(DISCORD.CLIENT.TOKEN)
  }
  public async sendToUser(discordId:string, text:Output, files?:string[]) {
    const user = await this.client.users.fetch(discordId)
    return user.send(formatOutput(text), { files })
  }
  public async sendToChannel(channelId:Discord.Snowflake, text:Output, files?:string[]) {
    const channel = this.client.channels.cache.get(channelId) as Discord.TextChannel | Discord.DMChannel
    return channel.send(formatOutput(text), { files })
  }
  public async triggerBotCommand(user:User, ...chain:string[]):Promise<Dispatch.Output> {
    return this.dispatchService.dispatch('', user, ...chain)
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
