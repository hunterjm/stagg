import * as Discord from 'discord.js'
import * as reports from './reports'
import relay from '../../relay'
import { hydratePlayerIdentifiers } from '../data'

export const help = (m:Discord.Message) => {
    console.log('MW Help? 404 Figure it out for yourself')
}

export namespace stats {
    const handler = async (m:Discord.Message, method:string, pids:string[]) => {
        console.log('mp handler')
        const rly = await relay(m, ['Loading player...'])
        const [fetchedPlayer] = await hydratePlayerIdentifiers(m.author.id, pids)
        if (!fetchedPlayer || !fetchedPlayer.player) {
            rly.edit(['Player not found...'])
            return
        }
        const response = await reports.all(fetchedPlayer.player, fetchedPlayer.query.platform)
        rly.edit(response)
    }
    export const all = async (m:Discord.Message, ...pids:string[]) => handler(m, 'all', pids)
    export const _default = all
}

export const _default = stats.all