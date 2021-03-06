import { EventHandler } from './handlers'
import * as Handlers from './handlers'

export interface EventInput<T> {
    type: string
    payload?: T
}

export class GlobalEventHandler {
    public readonly handlers = <EventHandler[] | typeof EventHandler[]>[
        Handlers.Account.Ready,
        Handlers.Account.Created,
        Handlers.CallOfDuty.WZ.Rank.Up,
        Handlers.CallOfDuty.WZ.Rank.Down,
        Handlers.CallOfDuty.WZ.Record.Kills,
        Handlers.CallOfDuty.WZ.Match.Created,
        Handlers.CallOfDuty.WZ.Match.Discovered,
        Handlers.CallOfDuty.WZ.Suspect.Created,
    ]
    constructor(
        private readonly inputEvent:EventInput<any>
    ) {
        this.initHandlers()
        this.dispatchEvent()
    }
    private initHandlers() {
        for(const i in this.handlers) {
            const handler = <typeof EventHandler>this.handlers[i]
            const Constructor = <any>handler
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
