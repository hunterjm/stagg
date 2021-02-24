import { MessageHandler } from '../handlers/message'
import { VoiceStateHandler } from '../handlers/voice'

export { BotHelp } from './help'
export { BarracksWZ, AliasBarracksWZ } from './barracks.wz'
export { CheckOnlineFriendsViaMessage } from './friends.message.online'
export { AddFriendViaMessage } from './friends.message.add'
export { RemoveFriendViaMessage } from './friends.message.remove'
export { RefreshFriendsViaInvite } from './friends.message.refresh'
export { VoiceStateFriendAutomation } from './friends.voice.auto'

export abstract class Feature {
    public namespace?:string
    public featureFlag?:string
    public async onMessage?(h:MessageHandler):Promise<void> {}
    public async onVoiceStateUpdate?(h:VoiceStateHandler):Promise<void> {}
    public async onVoiceConnect?(h:VoiceStateHandler):Promise<void> {}
    public async onVoiceDisconnect?(h:VoiceStateHandler):Promise<void> {}
}
