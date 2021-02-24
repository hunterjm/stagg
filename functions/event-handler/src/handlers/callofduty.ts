import * as Events from '@stagg/events'
import { EventInput, EventHandler, http } from '.'
import { config } from '../config'

export namespace WZ {
    export namespace Rank {
        export class Up implements EventHandler {
            public readonly eventType:string = Events.CallOfDuty.WZ.Rank.Up.Type
            public async callback({ payload: { account, oldRank, newRank } }:EventInput<Events.CallOfDuty.WZ.Rank.Payload>):Promise<void> {
                console.log('[+] Message report to spam channel')
            }
        }
        export class Down implements EventHandler {
            public readonly eventType:string = Events.CallOfDuty.WZ.Rank.Up.Type
            public async callback({ payload: { account, oldRank, newRank } }:EventInput<Events.CallOfDuty.WZ.Rank.Payload>):Promise<void> {
                console.log('[+] Message report to spam channel')
            }
        }
    }
    export namespace Record {
        export class Kills implements EventHandler {
            public readonly eventType:string = Events.CallOfDuty.WZ.Record.Kills.Type
            public async callback({ payload: { account, oldRecord, newRecord, oldRecordHolder } }:EventInput<Events.CallOfDuty.WZ.Record.Payload>):Promise<void> {
                console.log('[+] Message report to spam channel')
            }
        }
    }
    export namespace Suspect {
        export class Created implements EventHandler {
            public readonly eventType:string = Events.CallOfDuty.WZ.Suspect.Created.Type
            public async callback({ payload: { suspect, match } }:EventInput<Events.CallOfDuty.WZ.Suspect.Payload>):Promise<void> {
                console.log('[+] Message report to spam channel')
            }
        }
    }
    export namespace Match {
        export class Created implements EventHandler {
            public readonly eventType:string = Events.CallOfDuty.WZ.Match.Created.Type
            public async callback({ payload: { account, match } }:EventInput<Events.CallOfDuty.WZ.Match.Payload>):Promise<void> {
                console.log('[+] Assign Discord rank role')
                // if (match.end_time >= ) // only kickoff if relevant to rank
                http.get(`${config.network.host.faas.etl.discord.role}?discord_id=${account.discord_id}&limit=${config.discord.roles.ranking.limit}`)
                // console.log('[+] Message report to user for match')
                // Events.CallOfDuty.WZ.Rank.Up.Trigger({ account, oldRank: 0, newRank: 0 })
            }
        }
        export class Discovered implements EventHandler {
            public readonly eventType:string = Events.CallOfDuty.WZ.Match.Discovered.Type
            public async callback({ payload: { account, match } }:EventInput<Events.CallOfDuty.WZ.Match.Payload>):Promise<void> {
                console.log('[+] Check cheaters for match', match.match_id)
                http.get(`${config.network.host.faas.etl.cheaters}?match_id=${match.match_id}`)
            }
        }
    }
}
