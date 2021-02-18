import * as DB from '@stagg/db'
import * as Discord from 'discord.js'
import { BotService } from '../services'

export class VoiceStateHandler {
  public account:DB.Account.Entity
  public oldStateJoinedTime:number
  public oldStateConnectionDuration:number
  public readonly featureFlags:DB.Discord.Settings.Features.Entity[] = []
  public readonly oldStateFeatureFlags:DB.Discord.Settings.Features.Entity[] = []
  public readonly newStateFeatureFlags:DB.Discord.Settings.Features.Entity[] = []
  public readonly oldStateMembers:DB.Account.Entity[] = []
  public readonly newStateMembers:DB.Account.Entity[] = []
  constructor(
    private readonly service:BotService,
    public readonly oldState:Discord.VoiceState, 
    public readonly newState:Discord.VoiceState,
  ) {}
  public async process():Promise<boolean> {
    try {
      this.validateTrigger()
      await this.validateFeatures()
      await this.validateLog()
      await this.validateMember()
      await this.populateOldStateMembers()
      await this.populateNewStateMembers()
      await this.populateOldStateJoinedTime()
      return true
    } catch(e) { return false }
  }
  private validateTrigger() {
    if (this.oldState.member.id === this.service.client.user.id) {
      throw 'ignore activity from self'
    }
  }
  private async validateLog() {
    const saveLog = await this.saveVoiceActivityLog()
    if (!saveLog) {
      throw 'activity already handled'
    }
  }
  private async validateMember() {
    this.account = await this.service.acctRepo.findOne({ discord_id: this.oldState.member.id })
    if (!this.account) {
      throw 'unregistered user not allowed'
    }
  }
  private async validateFeatures() {
    if (this.oldState.channelID) {
      const leftServerFeatures = await this.service.ffRepo.findAll({ entity_type: 'server', entity_id: this.oldState.guild?.id })
      const leftChannelFeatures = await this.service.ffRepo.findAll({ entity_type: 'channel', entity_id: this.oldState.channelID })
      this.oldStateFeatureFlags.push(...leftChannelFeatures, ...leftServerFeatures)
    }
    if (this.newState.channelID) {
      const joinedServerFeatures = await this.service.ffRepo.findAll({ entity_type: 'server', entity_id: this.newState.guild?.id })
      const joinedChannelFeatures = await this.service.ffRepo.findAll({ entity_type: 'channel', entity_id: this.newState.channelID })
      this.newStateFeatureFlags.push(...joinedServerFeatures, ...joinedChannelFeatures)
    }
    this.featureFlags.push(...this.oldStateFeatureFlags, ...this.newStateFeatureFlags)
    if (!this.featureFlags.length) {
      throw 'no enabled feature flags'
    }
  }
  private async populateOldStateJoinedTime() {
    if (!this.oldState.channel) {
      return
    }
    const joinedLog = await this.service.logVoiceRepo.findOne(<any>{
      where: {
        user_id: this.oldState.member.id,
        channel_id: this.oldState.channelID,
        activity_type: 'join',
      },
      order: { created_datetime: 'DESC' }
    })
    if (!joinedLog) {
      return
    }
    this.oldStateJoinedTime = joinedLog.created_datetime.getTime() / 1000
    const now = new Date()
    const offsetMin = now.getTimezoneOffset()
    const offsetMS = offsetMin * 60 * 1000
    const utcTime = now.getTime() + offsetMS
    this.oldStateConnectionDuration = utcTime / 1000 - this.oldStateJoinedTime
    const addedTime = 1612116999
    const addedDate = new Date(addedTime * 1000 + offsetMS)
    console.log('Added friend:', addedDate)
    console.log('Log datetime:', joinedLog.created_datetime)
    console.log('UTC datetime:', new Date(utcTime))
  }
  private async populateOldStateMembers() {
    if (!this.oldState.channel) {
      return
    }
    for(const { id } of this.oldState.channel?.members?.array()) {
      if (id === this.account.discord_id) {
        continue
      }
      const acct = await this.service.acctRepo.findOne({ discord_id: id })
      if (acct) {
          this.oldStateMembers.push(acct)
      }
    }
  }
  private async populateNewStateMembers() {
    if (!this.newState.channel) {
      return
    }
    for(const { id } of this.newState.channel?.members?.array()) {
      if (id === this.account.discord_id) {
        continue
      }
      const acct = await this.service.acctRepo.findOne({ discord_id: id })
      if (acct) {
          this.newStateMembers.push(acct)
      }
    }
  }
  private async saveVoiceActivityLog():Promise<boolean> {
    try {
      if (this.newState.channelID) {
        const logRecord = <DB.Discord.Log.Voice.Entity>this.normalize(this.newState)
        await this.service.logVoiceRepo.save({ ...logRecord, activity_type: 'join' })
      }
      if (this.oldState.channelID) {
        const logRecord = <DB.Discord.Log.Voice.Entity>this.normalize(this.oldState)
        await this.service.logVoiceRepo.save({ ...logRecord, activity_type: 'leave' })
      }
      return true
    } catch(e) { return false }
  }
  private normalize(voiceState:Discord.VoiceState):Partial<DB.Discord.Log.Voice.Entity> {
    return {
      user_id: voiceState.member?.id,
      server_id: voiceState.guild?.id,
      channel_id: voiceState.channelID,
    }
  }
}
