import * as Discord from 'discord.js'
import { Connection } from 'mongoose'
import { InjectConnection } from '@nestjs/mongoose'
import { Injectable } from '@nestjs/common'
import { DISCORD_TOKEN } from 'src/config'
import { formatOutput, Output } from './util'

@Injectable()
export class DiscordBotService {
  private readonly client = new Discord.Client()
  constructor(
    @InjectConnection('discord') private db_discord: Connection,
  ) {
    this.client.login(DISCORD_TOKEN)
    this.client.on('ready', () => this.client.user.setActivity('for % messages...', {
      type: 'WATCHING',
      url: 'https://stagg.co'
    }))
    this.client.on('message', async (m:Discord.Message) => {
      return // block in production for now
      if (!this.trigger(m)) {
          return
      }
      // Message has a valid trigger, attempt to respond...
      try {
        // Attempt to partition the response, if we get past this we're the first to receive the request...
        await this.partition(m)
        // Partition successful, we're the first instance in the pool to receive the request, now we must process it...
        await this.reply(m, ['One moment...'])
        // Loading message sent, now dispatch the request and respond as necessary...
        await this.dispatch(m)
      } catch(e) {
        console.log('[.] Discord message request log already exists, ignoring...')
      }
    })
  }
  private trigger(m:Discord.Message):boolean {
    if (m.author.id === this.client.user.id) {
        return false // ignore any message from the bot itself
    }
    const input = m.content.trim().replace(`<@!${this.client.user.id}>`, '__BOT_TAG__') // clean + replace tag for regex
    if (m.channel.type !== 'dm' && !input.match(/^%/) && !input.match(/^__BOT_TAG__/)) {
        return false // ignore if not dm + no trigger
    }
    return true
  }
  private async partition(m:Discord.Message) {
    await this.db_discord.collection('log').insertOne({
        _id: m.id,
        createdAt: new Date().getUTCMilliseconds(),
        channel: {
          id: m.channel.id,
          type: m.channel.type,
        },
        request: {
          author: {
            id: m.author.id,
            avatar: m.author.avatar,
            tag: `${m.author.username}#${m.author.discriminator}`,
          },
          message: {
            id: m.id,
            content: m.content,
          }
        }
      })
  }
  private async reply(m:Discord.Message, output:Output, files?:string[]) {
    const log = await this.db_discord.collection('log').findOne({ _id: m.id })
    if (!log.response) {
        log.response = {
            createdAt: new Date().getUTCMilliseconds(),
            messages: []
        }
    }
    if (!log.response.messages) {
        log.response.messages = []
    }
    const res = !log.response.messages.length 
        ? await this.replyNew(m, output, files)
        : await this.replyUpdate(log, m, output, files)
    log.response.messages.push({
        id: res.id,
        createdAt: new Date().getUTCMilliseconds(),
        output,
        content: res.content,
    })
    await this.db_discord.collection('log').updateOne({ _id: log._id }, { $set: { ...log } })
  }
  private async replyNew(m:Discord.Message, output:Output, files?:string[]) {
    // No responses yet, send a fresh message...
    return m.channel.send(formatOutput(output), { files })
  }
  private async replyUpdate(log:any, m:Discord.Message, output:Output, files?:string[]):Promise<Discord.Message> {
    // We already have response(s), check if we need to update or delete and repost...
    const [firstReply] = log.response.messages
    const channel = this.client.channels.cache.get(m.channel.id) as Discord.TextChannel | Discord.DMChannel
    const rawResponseMessage = await channel.messages.fetch({ around: firstReply.id, limit: 1 })
    const [responseMessage] = rawResponseMessage.values()
    if (!files.length) {
        // no files, update previous response message rather than sending a new one
        return await responseMessage.edit(output)
    }
    // we do have file(s), delete the previous message before posting the file(s)
    responseMessage.delete()
    return m.channel.send(formatOutput(output), { files })
  }
  private async dispatch(m:Discord.Message) {
    const chain = m.content
        .replace(/^%\s*/, '') // remove % prefix and any following space
        .split(`<@!${this.client.user.id}>\s*`).join('') // remove bot tags and any following space
        .replace(/\s+/g, ' ') // replace multiple spaces with single space
        .trim() // trim space from ends
        .split(' ') // split into array of words
  }
  private async dispatchCommand(m:Discord.Message) {
    // const chain = input.replace(/^%\s*/, '').replace('__BOT_TAG__', '').replace(/\s+/, ' ').trim().split(' ')
    // let dispatcher = cmds as any
    // let lastDispatcherIndex = 0
    // for(const i in chain) {
    //     const child = chain[i].toLowerCase()
    //     if (dispatcher[child]) {
    //         dispatcher = dispatcher[child]
    //         lastDispatcherIndex = Number(i)
    //         continue
    //     }
    //     const strippedChild = child.replace(/s$/i, '')
    //     if (dispatcher[strippedChild] || dispatcher['_default']) {
    //         lastDispatcherIndex = Number(i) - 1
    //         dispatcher = dispatcher[strippedChild] ? dispatcher[strippedChild] : dispatcher['_default']
    //     }
    // }
    // if (!dispatcher || typeof dispatcher !== 'function') {
    //     // check shortcuts here?
    //     await this.reply(m, ['Invalid command, try `help`'])
    //     return // invalid cmd
    // }
    // dispatcher(m, ...chain.slice(lastDispatcherIndex+1))
  }
}
