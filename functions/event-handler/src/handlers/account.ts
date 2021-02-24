import * as Events from '@stagg/events'
import { EventInput, EventHandler, http } from '.'
import { config } from '../config'

export class Created implements EventHandler {
    public readonly eventType:string = Events.Account.Created.Type
    public async callback({ payload: { account } }:EventInput<Events.Account.Payload>):Promise<void> {
        // Kick-off account data ETL
        console.log('[+] Kick-off Account Data ETL for', account.account_id)
        http.get(`${config.network.host.faas.etl.account}?account_id=${account.account_id}&fresh=true`)
        // Send welcome message to user on Discord
        console.log('[+] Send Discord welcome message to', account.discord_id)
        http.post(config.network.host.faas.bot.message, { user: account.discord_id, payload: config.discord.messages.account.welcome })
    }
}

export class Ready implements EventHandler {
    public readonly eventType:string = Events.Account.Ready.Type
    public async callback({ payload: { account } }:EventInput<Events.Account.Payload>):Promise<void> {
        console.log('[+] Send Discord ready message to', account.discord_id)
        http.post(config.network.host.faas.bot.message, { user: account.discord_id, payload: config.discord.messages.account.ready })
        // Send alert to public channel on Discord
        console.log('[+] Send Discord welcome alert to', config.discord.channels.public.reporting)
        http.post(config.network.host.faas.bot.message, { channel: config.discord.channels.public.reporting, payload: [
            `**Welcome <@!${account.discord_id}> aka \`${account.callofduty_uno_username}\`!!!** 👋🥳🎉`,
            `${config.network.host.web}/${account.callofduty_uno_username.replace('#', '@')}/wz/barracks`,
            '```',
            `% wz ${account.callofduty_uno_username} 7d`,
            '```',
        ] })
    }
}
