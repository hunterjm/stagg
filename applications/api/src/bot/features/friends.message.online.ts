import API from '@callofduty/api'
import { MessageHandler } from '../handlers/message'
import { Feature } from '.'

export class CheckOnlineFriendsViaMessage implements Feature {
    public namespace:string = 'online'
    public async onMessage(handler:MessageHandler):Promise<void> {
        const api = new API(handler.authorAccount.callofduty_authorization_tokens)
        const friends = await api.Friends()
        const onlineUnoUsernames:string[] = []
        for(const friend of friends.uno) {
            if (friend.status?.online) {
                onlineUnoUsernames.push(friend.username)
            }
        }
        for(const platformFriendGroup of Object.values(friends.firstParty)) {
            for(const friend of platformFriendGroup) {
                if (friend.identities?.uno && friend.status?.online) {
                    onlineUnoUsernames.push(friend.identities.uno.username)
                }
            }
        }
        await handler.reply([...new Set(onlineUnoUsernames.sort())])
    }
}

