import { config } from 'src/config'
import { MessageHandler } from '../handlers/message'
import { Feature } from '.'

export class BotHelp implements Feature {
    public namespace:string = 'help'
    public async onMessage(handler:MessageHandler):Promise<void> {
        await handler.reply(config.discord.messages.help)
    }
}

