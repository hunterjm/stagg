import * as DB from '@stagg/db'
import { EventInput, EventHandler } from '.'

export interface MatchEventInput extends EventInput {
    account: DB.Account.Entity
    match: DB.CallOfDuty.WZ.Match.Entity
}
export class NewMatchHandlerWZ implements EventHandler {
    public readonly eventType:string = 'callofduty/wz/match'
    public async callback({ account, match }:MatchEventInput):Promise<void> {
        console.log('[+] Message report to user for match')
    }
}
