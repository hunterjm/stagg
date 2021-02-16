import * as DB from '@stagg/db'
import * as Discord from 'discord.js'
import { CONFIG } from 'src/config'
import { BotService } from '../services'

export function commaNum(num:number) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
export function format(input:string[]):string {
  return truncate(input.reduce((prev, curr) => prev + `> ${curr}\n`, ''))
}
export function truncate(input:string):string {
  let truncatedResponse = input
  if (truncatedResponse.length > 2000) {
      const closingCodeTag = '...```'
      const truncatedDisclaimer = `\n> _Message truncated; original message ${commaNum(input.length)} chars long_`
      const baseIndex = 2000 - truncatedDisclaimer.length
      truncatedResponse = truncatedResponse.slice(0, baseIndex)
      const hasUnclosedCodeTag = !(truncatedResponse.split('```').length % 2)
      if (hasUnclosedCodeTag) truncatedResponse = truncatedResponse.slice(0, baseIndex - closingCodeTag.length) + closingCodeTag
      truncatedResponse += truncatedDisclaimer
  }
  return truncatedResponse
}

export type BotMessage = string[]
export type BotAttachment = { files: string[], content?: string }
export type BotResponse = BotMessage | BotAttachment
export class MessageHandler {
  public authorAccount:DB.Account.Entity
  public readonly chain:string[] = []
  public readonly accounts:DB.Account.Entity[] = []
  public readonly responses:Discord.Message[] = []
  constructor(
    private readonly service:BotService,
    private readonly message:Discord.Message,
  ) {}
  public async reply(m:BotResponse):Promise<DB.Discord.Log.Response.Entity> {
    const mMsg = <BotMessage>m
    const formattedMsg = mMsg.length ? format(mMsg) : m
    const sentMsg = await this.message.channel.send(formattedMsg)
    this.responses.push(sentMsg)
    const response = this.normalizeResponse(m, sentMsg)
    await this.service.logResRepo.save(response)
    if (this.responses.length > 1) {
      const [firstReply] = this.responses
      try { await firstReply.delete() } catch(e) {}
    }
    return response
  }
  public async process() {
    this.validateTrigger()
    await this.validateLog()
    await this.validateAuthor()
    await this.acknowledgementReply()
    await this.parseMessage()
  }
  private async acknowledgementReply() {
    return this.reply(CONFIG.DISCORD_INITIAL_REPLY)
  }
  private validateTrigger() {
    if (this.message.author.bot) {
      throw 'ignore messages from bots'
    }
    if (this.message.author.id === this.service.client.user.id) {
      throw 'ignore messages from self'
    }
    const input = this.message.content.trim().replace(`<@!${this.service.client.user.id}>`, '__BOT_TAG__') // clean + replace tag for regex
    if (this.message.channel.type !== 'dm' && !input.match(/^%/) && !input.match(/^__BOT_TAG__/)) {
      throw 'ignore messages in public channels without trigger'
    }
  }
  private async validateLog() {
    const msgLog = await this.saveMessageLog()
    if (!msgLog) {
      throw 'message already handled'
    }
  }
  private async validateAuthor() {
    this.authorAccount = await this.service.acctRepo.findOne({ discord_id: this.message.author.id })
    if (!this.authorAccount) {
      await this.reply(CONFIG.DISCORD_UNREGISTERED_REPLY)
      throw 'unregistered user not allowed'
    }
  }
  private async parseMessage() {
    const chain = this.message.content
      .replace(/^%\s*/, '') // remove % prefix and any following space
      .split(`<@!${this.service.client.user.id}>\s*`).join('') // remove bot tags and any following space
      .replace(/\s+/g, ' ') // replace multiple spaces with single space
      .trim() // trim space from ends
      .split(' ') // split into array of words
    for(const i in chain) {
      if (chain[i].match(/<@!([0-9]+)>/)) {
        const discordId = chain[i].replace(/<@!([0-9]+)>/, '$1')
        const memberAcct = await this.service.acctRepo.findOne({ discord_id: discordId })
        if (memberAcct) {
          this.accounts.push(memberAcct)
        }
        delete chain[i]
      }
    }
    this.chain.push(...chain.filter(str => str))
  }
  private async saveMessageLog():Promise<DB.Discord.Log.Message.Entity> {
    try { return this.service.logMsgRepo.save(this.normalize()) } catch(e) { console.log(e); return null }
  }
  private normalizeResponse(response:BotResponse, m:Discord.Message):DB.Discord.Log.Response.Entity {
    const { files } = <BotAttachment>response
    return {
      id: m.id,
      author: m.author.id,
      content: m.content,
      files,
      attachments: m.attachments?.map(a => a.attachment.toString()),
    }
  }
  private normalize():DB.Discord.Log.Message.Entity {
    return {
      id: this.message.id,
      author: this.message.author.id,
      content: this.message.content,
      server_id: this.message.guild?.id,
      channel_id: this.message.channel.id,
    }
  }
}
