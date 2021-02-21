import axios from 'axios'
import * as DB from '@stagg/db'

export interface EventInput {
    type: string
    payload?: EventPayload
}
export interface EventPayload {
    account?: DB.Account.Entity
}


let eventHandlerUrl = 'https://us-east1-staggco.cloudfunctions.net/event-handler'
const dispatchEvent = async (type:string, payload:any) => axios.post(eventHandlerUrl, { type, payload })
export const SetEventHandlerUrl = (url:string) => (eventHandlerUrl = url)

export namespace Account {
    export interface Payload extends EventPayload {
        account: DB.Account.Entity
    }
    export namespace Created {
        export const Type = 'account/new'
        export const Trigger = async (payload:Payload) => dispatchEvent(Type, payload)
    }
    export namespace Ready {
        export const Type = 'account/ready'
        export const Trigger = async (payload:Payload) => dispatchEvent(Type, payload)
    }
}

export namespace CallOfDuty {
    export namespace WZ {
        export namespace Match {
            export interface Payload extends Account.Payload {
                match: DB.CallOfDuty.WZ.Match.Entity
            }
            export namespace Created {
                export const Type = 'callofduty/wz/match/new'
                export const Trigger = async (payload:Payload) => dispatchEvent(Type, payload)
            }
        }
    }   
}
