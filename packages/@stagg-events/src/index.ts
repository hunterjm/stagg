import axios from 'axios'
import * as DB from '@stagg/db'

export interface EventInput {
    type: string
    payload?: EventPayload
}
export interface EventPayload {
    account?: DB.Account.Entity
}

const dispatchEvent = async (type:string, payload:any) => axios.post('', { type, payload })

let eventHandlerUrl = 'https://us-east1-staggco.cloudfunctions.net/event-handler'
export const SetEventHandlerUrl = (url:string) => (eventHandlerUrl = url)

export namespace Account {
    export interface Payload extends EventPayload {
        account: DB.Account.Entity
    }
    export const Created = async (payload:Payload) => {

    }
    export const Ready = async (payload:Payload) => {

    }
}

export namespace CallOfDuty {
    export namespace WZ {
        export namespace Match {
            export interface Payload extends Account.Payload {
                match: DB.CallOfDuty.WZ.Match.Entity
            }
            export const Created = async (payload:Payload) => {

            }
        }
    }   
}
