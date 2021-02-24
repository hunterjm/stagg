import axios from 'axios'
import * as DB from '@stagg/db'
import { getEnvSecret } from '@stagg/gcp'

export interface EventInput {
    type: string
    payload?: EventPayload
}
export interface EventPayload {
    account?: DB.Account.Entity
}


let networkKey = ''
let eventHandlerUrl = 'https://us-east1-staggco.cloudfunctions.net/event-handler'
const setNetworkKey = async () => {
    networkKey = await getEnvSecret('NETWORK_KEY')
}
const dispatchEvent = async (type:string, payload:any) => {
    if (!networkKey) await setNetworkKey()
    console.log('[^]', eventHandlerUrl, type)
    axios.post(eventHandlerUrl, { type, payload }, { headers: { 'x-network-key': networkKey } }).catch(() => {})
}
export const SetEventHandlerUrl = (url:string) => (eventHandlerUrl = url)

export namespace Account {
    export interface Payload extends EventPayload {
        account: DB.Account.Entity
    }
    export namespace Created {
        export const Type = 'account/created'
        export const Trigger = async (payload:Payload) => dispatchEvent(Type, payload)
    }
    export namespace Ready {
        export const Type = 'account/ready'
        export const Trigger = async (payload:Payload) => dispatchEvent(Type, payload)
    }
}

export namespace CallOfDuty {
    export namespace WZ {
        export namespace Record {
            export interface Payload extends Account.Payload {
                oldRecord: number
                newRecord: number
                oldRecordHolder: Partial<DB.Account.Entity>
            }
            export namespace Kills {
                export const Type = 'callofduty/wz/record/kills'
                export const Trigger = async (payload:Payload) => dispatchEvent(Type, payload)
            }
        }
        export namespace Rank {
            export interface Payload extends Account.Payload {
                oldRank: number
                newRank: number
            }
            export namespace Up {
                export const Type = 'callofduty/wz/rank/up'
                export const Trigger = async (payload:Payload) => dispatchEvent(Type, payload)
            }
            export namespace Down {
                export const Type = 'callofduty/wz/rank/down'
                export const Trigger = async (payload:Payload) => dispatchEvent(Type, payload)
            }
        }
        export namespace Suspect {
            export interface Payload extends Match.Payload {
                suspect: DB.CallOfDuty.WZ.Suspect.Entity
            }
            export namespace Created {
                export const Type = 'callofduty/wz/suspect/created'
                export const Trigger = async (payload:Payload) => dispatchEvent(Type, payload)
            }
        }
        export namespace Match {
            export interface Payload extends Account.Payload {
                match: DB.CallOfDuty.WZ.Match.Entity
            }
            export namespace Created {
                export const Type = 'callofduty/wz/match/created'
                export const Trigger = async (payload:Payload) => dispatchEvent(Type, payload)
            }
            export namespace Discovered {
                export const Type = 'callofduty/wz/match/discovered'
                export const Trigger = async (payload:Payload) => dispatchEvent(Type, payload)
            }
        }
    }   
}
