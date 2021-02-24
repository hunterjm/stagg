import axios from 'axios'
export * as Account from './account'
export * as CallOfDuty from './callofduty'
import { EventInput } from '../events'
import { config } from '../config'

export namespace http {
    const log = (method:string, url:string, payload?:any) => console.log(`[${method}](${config.network.key}): ${url}`, payload)
    const reqConfig = () => ({ headers: { 'x-network-key': config.network.key } })
    const translateError = e => !e?.response?.data ? e : e.response.data
    export const get = async (url:string) => {
        log('GET', url)
        axios.get(url, reqConfig())
            .catch(e => console.log('[!] Event handler http failure:', translateError(e)))
    }
    export const post = async (url:string, payload:any) => {
        log('POST', url, payload)
        axios.post(url, payload, reqConfig())
            .catch(e => console.log('[!] Event handler http failure:', translateError(e)))
    }
}

export { EventInput }
export abstract class EventHandler {
    public readonly eventType:string
    public async callback(e:EventInput<any>):Promise<void> {}
}
