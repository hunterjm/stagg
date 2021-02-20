import * as DB from '@stagg/db'
import { getCustomRepository } from 'typeorm'
import {
    EventHandler,
    NewMatchHandlerWZ,
    NewAccountHandler,
    EtlCompletionHandler,
} from './handlers'

export interface EventInput {
    type: string
    account?: DB.Account.Entity
}

export class GlobalEventHandler {
    public readonly acctRepo:DB.Account.Repository = getCustomRepository(DB.Account.Repository)
    public readonly handlers = <EventHandler[] | typeof EventHandler[]>[
        NewMatchHandlerWZ,
        NewAccountHandler,
        EtlCompletionHandler,
    ]
    constructor(
        private readonly inputEvent:EventInput
    ) {
        this.initHandlers()
        this.dispatchEvent()
    }
    private initHandlers() {
        for(const i in this.handlers) {
            const handler = <typeof EventHandler>this.handlers[i]
            const Constructor = <any>handler
            console.log(`[@] Loading event handler "${handler.prototype.constructor.name}"`)
            this.handlers[i] = new Constructor(this)
        }
    }
    private dispatchEvent() {
        for(const handler of <EventHandler[]>this.handlers) {
            if (this.inputEvent.type === handler.eventType) {
                handler.callback(this.inputEvent)
            }
        }
    }
}
