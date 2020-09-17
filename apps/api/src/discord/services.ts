import * as Discord from 'discord.js'
import { Injectable } from '@nestjs/common'
import { DISCORD_TOKEN } from 'src/config'
import { formatOutput, Output } from './util'

@Injectable()
export class DiscordService {
  public readonly client = new Discord.Client()
  constructor() {
    this.client.login(DISCORD_TOKEN)
  }
  public async sendToUser(discordId:string, text:Output, files?:string[]) {
    const user = await this.client.users.fetch(discordId)
    return user.send(formatOutput(text), { files })
  }
  public async sendToChannel(channelId:Discord.Snowflake, text:Output, files?:string[]) {
    const channel = this.client.channels.cache.get(channelId) as Discord.TextChannel | Discord.DMChannel
    return channel.send(formatOutput(text), { files })
  }
}
