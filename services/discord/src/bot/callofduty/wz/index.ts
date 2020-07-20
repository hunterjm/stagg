import * as Discord from 'discord.js'
import * as reports from './reports'
import relay from '../../relay'
import teams from './teams'
import charts from './charts'
import { hydratePlayerIdentifiers } from '../data'

export { teams }
export { charts }

export const help = (m:Discord.Message) => {
    console.log('Woot!')
}

export namespace list {
    export const stats = (m:Discord.Message) => {
        relay(m, [
            'Available stats:',
            '```',
            [
                'score', 'kills', 'deaths', 'timePlayed', 'teamPlacement', 'eliminations', 'damageDone', 'damageTaken', 'teamWipes', 
                'revives', 'contracts', 'lootCrates', 'buyStations', 'assists', 'executions', 'headshots', 'wallBangs', 'clusterKills', 
                'airstrikeKills', 'longestStreak', 'trophyDefense', 'munitionShares', 'missileRedirects', 'equipmentDestroyed', 
                'percentTimeMoving', 'distanceTraveled', 'teamSurvivalTime', 
            ].join(', '),
            '```',
        ])
    }
    export const _default = stats
}

export namespace stats {
    const handler = async (m:Discord.Message, method:string, pids:string[]) => {
        const rly = await relay(m, ['Loading player...'])
        const [fetchedPlayer] = await hydratePlayerIdentifiers(m.author.id, pids)
        if (!fetchedPlayer) {
            rly.edit(['Player not found...'])
            return
        }
        let teamSizes = [, 'solo', 'duo', 'trio', 'quad']
        const response = ['all', 'combined'].includes(method)
            ? await reports[method](fetchedPlayer.player, fetchedPlayer.query.platform)
            : await reports.isolated(teamSizes.indexOf(method), fetchedPlayer.player, fetchedPlayer.query.platform)
        rly.edit(response)
    }
    export const solo     = async (m:Discord.Message, ...pids:string[]) => handler(m, 'solo', pids)
    export const duo      = async (m:Discord.Message, ...pids:string[]) => handler(m, 'duo', pids)
    export const trio     = async (m:Discord.Message, ...pids:string[]) => handler(m, 'trio', pids)
    export const quad     = async (m:Discord.Message, ...pids:string[]) => handler(m, 'quad', pids)
    export const all      = async (m:Discord.Message, ...pids:string[]) => handler(m, 'all', pids)
    export const combined = async (m:Discord.Message, ...pids:string[]) => handler(m, 'combined', pids)
    export const _default = all
}

export const _default = stats.all

// namespace wz {
//     export const dispatcher = async (m:Discord.Message) => {
//         const [, operator ] = msg.args(m)
//         operator === 'chart' ? chart(m) : report(m)
//     }
//     const report = async (m:Discord.Message) => {
//         const [, mode ] = msg.args(m)
//         const depluralizedMode = mode.replace(/s$/i, '')
//         return ['all', 'combined', 'solo', 'duo', 'trio', 'quad'].includes(depluralizedMode) 
//             ? byMode(m, depluralizedMode) : msg.send(m, staticRes.invalid)
//     }
//     const chart = async (m:Discord.Message) => {
//         statOverTime(m)
//     }
// }