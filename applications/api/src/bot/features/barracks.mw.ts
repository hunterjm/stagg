import { CONFIG } from 'src/config'
import { MessageHandler } from '../handlers/message'
import { Feature } from '.'

export class BarracksMW implements Feature {
    public namespace:string = 'mw barracks'
    public async onMessage(handler:MessageHandler):Promise<void> {
        await handler.reply({ files: [`${CONFIG.HOST_RENDER_HTML}?url=/m/mw/barracks&width=1000&f=/MellowD_6992980.barracks.jpg`] })
    }
}

