import * as Events from '@stagg/events'
import { EventInput, EventHandler } from '.'

export class Created implements EventHandler {
    public readonly eventType:string = Events.Account.Created.Type
    public async callback({ payload: { account } }:EventInput<Events.Account.Payload>):Promise<void> {
        console.log('[+] Send Discord welcome message to', account.discord_id)
        console.log('[+] Kick-off Account Data ETL for', account.account_id)
    }
    private async triggerETL() {}
    private async notifyDiscordChannel() {}
    private async sendDiscordWelcomeMessage() {}
}

export class Ready implements EventHandler {
    public readonly eventType:string = Events.Account.Ready.Type
    public async callback({ payload: { account } }:EventInput<Events.Account.Payload>):Promise<void> {
        console.log('[+] Send Discord welcome message to', account.discord_id)
    }
    private async sendDiscordReadyMessage() {}
}
