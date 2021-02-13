import API from '@callofduty/api'
import { VoiceStateHandler } from '../handlers/voice'
import { BotService } from '../services'
import { Feature } from '.'

const delay = async (delay:number) => new Promise(resolve => setTimeout(resolve, delay))
export class VoiceStateFriendAutomation implements Feature {
    public featureFlag:string = 'FRIEND_AUTO_VOICE_STATE'
    constructor(
      private readonly service:BotService
    ) {}
    public async onVoiceConnect(handler:VoiceStateHandler):Promise<void> {
        console.log(`${handler.newState.member.id} [JOINED] ${handler.newState.channel.id} | Channel members:`, handler.newStateMembers)
    }
    public async onVoiceDisconnect(handler:VoiceStateHandler):Promise<void> {
        const differentialOffsetSec = 5
        const timezoneOffsetMin = new Date().getTimezoneOffset()
        const friendAddedThreshold = handler.oldStateJoinedTime - timezoneOffsetMin * 60 - differentialOffsetSec
        console.log('Looking for friends added >=', handler.oldStateJoinedTime - timezoneOffsetMin * 60 - differentialOffsetSec)
        console.log('Joined at:', handler.oldStateJoinedTime)
        console.log('Connection duration:', handler.oldStateConnectionDuration)
        console.log(`${handler.oldState.member.id}  [LEFT]  ${handler.oldState.channel.id} | Channel members:`, handler.oldStateMembers)
        const activeUserAPI = new API(handler.account.callofduty_authorization_tokens)
        const friends = await activeUserAPI.Friends()
    }
}
