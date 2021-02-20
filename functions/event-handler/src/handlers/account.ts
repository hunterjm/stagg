import { EventInput, EventHandler } from '.'

export class NewAccountHandler implements EventHandler {
    public readonly eventType:string = 'account/new'
    public async callback({ account }:EventInput):Promise<void> {
        console.log('[+] Send Discord welcome message to', account.discord_id)
        console.log('[+] Kick-off Account Data ETL for', account.account_id)
    }
}

export class EtlCompletionHandler implements EventHandler {
    public readonly eventType:string = 'account/ready'
    public async callback({ account }:EventInput):Promise<void> {
        console.log('[+] Send Discord welcome message to', account.discord_id)
    }
}
