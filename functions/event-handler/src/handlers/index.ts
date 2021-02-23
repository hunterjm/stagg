import axios from 'axios'
export * as Account from './account'
export * as CallOfDuty from './callofduty'
import { EventInput } from '../events'
import { SECRETS } from '../config'

export namespace http {
    const log = (method:string, url:string, payload?:any) => console.log(`[${method}](${SECRETS.NETWORK_KEY}): ${url}`, payload)
    const reqConfig = () => ({ headers: { 'x-network-key': SECRETS.NETWORK_KEY } })
    export const get = async (url:string) => { log('GET', url); axios.get(url, reqConfig()) }
    export const post = async (url:string, payload:any) => { log('POST', url, payload); axios.post(url, payload, reqConfig()) }
}

export { EventInput }
export abstract class EventHandler {
    public readonly eventType:string
    public async callback(e:EventInput<any>):Promise<void> {}
}
