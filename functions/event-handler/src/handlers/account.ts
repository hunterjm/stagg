import axios from 'axios'
import * as Events from '@stagg/events'
import { EventInput, EventHandler } from '.'
import { CONFIG } from '../config'

export class Created implements EventHandler {
    public readonly eventType:string = Events.Account.Created.Type
    public async callback({ payload: { account } }:EventInput<Events.Account.Payload>):Promise<void> {
        // Kick-off account data ETL
        console.log('[+] Kick-off Account Data ETL for', account.account_id)
        axios.get(`${CONFIG.host.etl.account}?account_id=${account.account_id}&fresh=true`)
        // Send welcome message to user on Discord
        console.log('[+] Send Discord welcome message to', account.discord_id)
        axios.post(CONFIG.host.bot, { user: account.discord_id, payload: CONFIG.bot.messages.welcome })
    }
}

export class Ready implements EventHandler {
    public readonly eventType:string = Events.Account.Ready.Type
    public async callback({ payload: { account } }:EventInput<Events.Account.Payload>):Promise<void> {
        console.log('[+] Send Discord ready message to', account.discord_id)
        axios.post(CONFIG.host.bot, { user: account.discord_id, payload: CONFIG.bot.messages.ready })
        // Send alert to public channel on Discord
        console.log('[+] Send Discord welcome alert to', CONFIG.bot.channels.reporting.public)
        axios.post(CONFIG.host.bot, { channel: CONFIG.bot.channels.reporting.public, payload: [
            `**Welcome <@!${account.discord_id}> aka \`${account.callofduty_uno_username}\`!!!** 👋🥳🎉`,
            `${CONFIG.host.web}/${account.callofduty_uno_username.replace('#', '@')}/wz/barracks`,
            '```',
            `% wz ${account.callofduty_uno_username} 7d`,
            '```',
        ] })
    }
}
