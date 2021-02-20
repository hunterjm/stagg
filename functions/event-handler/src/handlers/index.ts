import { EventInput } from '../events'
export {
    NewAccountHandler,
    EtlCompletionHandler,
} from './account'
export { NewMatchHandlerWZ } from './wz.match'

export { EventInput }
export abstract class EventHandler {
    public readonly eventType:string
    public async callback(e:EventInput):Promise<void> {}
}
