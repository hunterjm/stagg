import { CONFIG } from 'src/config'
import { MessageHandler } from '../handlers/message'
import { Feature } from '.'

export class BotHelp implements Feature {
    public namespace:string = 'help'
    public async onMessage(handler:MessageHandler):Promise<void> {
        await handler.reply(CONFIG.DISCORD_HELP_REPLY)
    }
}

