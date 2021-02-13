import API from '@callofduty/api'
import { MessageHandler } from '../handlers/message'
import { Feature } from '.'

export class AddFriendViaMessage implements Feature {
    public namespace:string = 'friend'
    public async onMessage(handler:MessageHandler):Promise<void> {
        if (!handler.accounts.length) {
            await handler.reply(['You must tag at least one other user'])
            return
        }
        const api = new API(handler.authorAccount.callofduty_authorization_tokens)
        for(const { callofduty_uno_id } of handler.accounts) {
            await api.FriendAction(callofduty_uno_id, 'invite')
        }
    }
}

