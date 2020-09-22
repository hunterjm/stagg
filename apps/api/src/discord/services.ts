import * as Discord from 'discord.js'
import { Injectable } from '@nestjs/common'
import { DISCORD_TOKEN } from 'src/config'
import { User } from 'src/user/schemas'
import { Dispatch } from 'src/discord/bot/services.dispatch'
import { formatOutput, Output } from 'src/discord/bot/util'
import { DiscordBotDispatchService } from 'src/discord/bot/services.dispatch'

@Injectable()
export class DiscordService {
  public readonly client = new Discord.Client()
  constructor(
    private readonly dispatchService: DiscordBotDispatchService
  ) {
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
  public async triggerBotCommand(user:User, ...chain:string[]):Promise<Dispatch.Output> {
    return this.dispatchService.dispatch(user, ...chain)
  }
}
