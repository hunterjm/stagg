import API from '@callofduty/api'
import { MessageHandler } from '../handlers/message'
import { config } from 'src/config'
import { Feature } from '.'

const FRIEND_AUTO_REMOVAL_TIMEOUT = 15000
export class RefreshFriendsViaInvite implements Feature {
    public namespace:string = 'fixfriends'
    private readonly botAPI = new API(config.callofduty.bot.auth)
    public async onMessage(handler:MessageHandler):Promise<void> {
        await handler.reply([
            'Accept the incoming friend request as demonstrated here:',
            'https://www.youtube.com/watch?v=RpcN74fPFDk'
        ])
        await this.remove(handler.authorAccount.callofduty_uno_id)
        await this.botAPI.FriendAction(handler.authorAccount.callofduty_uno_id, 'invite')
        setTimeout(async () => this.remove(handler.authorAccount.callofduty_uno_id), FRIEND_AUTO_REMOVAL_TIMEOUT)
    }
    private async remove(unoId:string) {
        await this.botAPI.FriendAction(unoId, 'remove')
        await this.botAPI.FriendAction(unoId, 'uninvite')
    }
}

