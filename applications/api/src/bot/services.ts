import * as DB from '@stagg/db'
import * as Discord from 'discord.js'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { SECRETS, CONFIG } from 'src/config'
import { VoiceStateHandler } from './handlers/voice'
import { MessageHandler, format, BotMessage } from './handlers/message'
import {
    Feature,
    BotHelp,
    BarracksWZ,
    // BarracksMW,
    AddFriendViaMessage,
    RemoveFriendViaMessage,
    RefreshFriendsViaInvite,
    VoiceStateFriendAutomation,
    CheckOnlineFriendsViaMessage,
} from './features'

@Injectable()
export class BotService {
  public readonly client:Discord.Client
  public readonly features = <Feature[]>[
    BotHelp,
    // BarracksMW,
    BarracksWZ,
    AddFriendViaMessage,
    RemoveFriendViaMessage,
    RefreshFriendsViaInvite,
    VoiceStateFriendAutomation,
    CheckOnlineFriendsViaMessage,
  ]
  @InjectRepository(DB.Account.Entity, 'stagg')
  public readonly acctRepo: DB.Account.Repository
  @InjectRepository(DB.Discord.Log.Message.Entity, 'stagg')
  public readonly logMsgRepo: DB.Discord.Log.Message.Repository
  @InjectRepository(DB.Discord.Log.Response.Entity, 'stagg')
  public readonly logResRepo: DB.Discord.Log.Response.Repository
  @InjectRepository(DB.Discord.Log.Voice.Entity, 'stagg')
  public readonly logVoiceRepo: DB.Discord.Log.Voice.Repository
  @InjectRepository(DB.Discord.FeatureFlag.Entity, 'stagg')
  public readonly ffRepo: DB.Discord.FeatureFlag.Repository
  constructor() {
    this.initFeatures()
    this.client = new Discord.Client()
    this.client.login(SECRETS.DISCORD_TOKEN)
    this.client.on('ready', this.onReady.bind(this))
    this.client.on('message', this.onMessage.bind(this))
    this.client.on('voiceStateUpdate', this.onVoiceStateUpdate.bind(this))
  }
  public async messageUser(discord_id:string, message:BotMessage) {
    const user = await this.client.users.fetch(discord_id)
    const sentMsg = await user.send(format(message))
    await this.logMsgRepo.save(<any>{ id: sentMsg.id, author: this.client.user.id, content: sentMsg.content })
  }
  private initFeatures() {
    for(const i in this.features) {
      const feature = <any>this.features[i]
      console.log(`[@] Using feature ${feature.prototype.constructor.name}`)
      this.features[i] = new feature(this)
    }
  }
  private onReady() {
    console.log(`[+] Using bot ${this.client.user.tag}`)
    this.client.user.setActivity(`for % in ${this.client.guilds.cache.array().length} servers`, {
      type: 'WATCHING',
      url: 'https://stagg.co'
    })
    console.log(
        `${'\x1b[32m' /* green */}${'\x1b[1m' /* bright/bold */}`+
        `----------------------------------------------------------\n`+
        `| Discord bot online: ${this.client.user.tag}\n`+
        `----------------------------------------------------------${'\x1b[0m' /* reset */}`
    )
  }
  private async onMessage(m:Discord.Message) {
    const handler = new MessageHandler(this, m)
    try { await handler.process() } catch(e) { return }
    let consumableFeatureFound = false
    for(const feature of this.features) {
      if (feature.onMessage) {
        let namespaceMatch = true
        const splitNamespace = feature.namespace.replace(/ +/g, ' ').trim().split(' ')
        for(const i in splitNamespace) {
          if (handler.chain[i] !== splitNamespace[i]) {
            namespaceMatch = false
          }
        }
        if (namespaceMatch) {
          feature.onMessage(handler)
          consumableFeatureFound = true
        }
      }
    }
    if (!consumableFeatureFound) {
      await handler.reply(CONFIG.DISCORD_INVALID_REPLY)
    }
  }
  private async onVoiceStateUpdate(oldState:Discord.VoiceState, newState:Discord.VoiceState) {
    const handler = new VoiceStateHandler(this, oldState, newState)
    const isDigestable = await handler.process()
    if (!isDigestable) {
      return
    }
    const oldFlags = handler.oldStateFeatureFlags.map(f => f.feature_flag)
    const newFlags = handler.newStateFeatureFlags.map(f => f.feature_flag)
    const allFeatureFlags = [...oldFlags, ...newFlags]
    for(const feature of this.features) {
      if (!feature.onVoiceStateUpdate && !feature.onVoiceConnect && !feature.onVoiceDisconnect) {
        continue
      }
      if (feature.onVoiceStateUpdate && allFeatureFlags.includes(feature.featureFlag)) {
        feature.onVoiceStateUpdate(handler)
      }
      if (feature.onVoiceDisconnect && oldFlags.includes(feature.featureFlag)) {
        feature.onVoiceDisconnect(handler)
      }
      if (feature.onVoiceConnect && newFlags.includes(feature.featureFlag)) {
        feature.onVoiceConnect(handler)
      }
    }
  }
}
