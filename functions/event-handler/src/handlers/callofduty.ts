import * as DB from '@stagg/db'
import * as Events from '@stagg/events'
import { EventInput, EventHandler } from '.'

export namespace WZ {
    export namespace Match {
        export class Created implements EventHandler {
            public readonly eventType:string = Events.CallOfDuty.WZ.Match.Created.Type
            public async callback({ payload: { account, match } }:EventInput<Events.CallOfDuty.WZ.Match.Payload>):Promise<void> {
                console.log('[+] Message report to user for match')
            }
        }
    }
}
