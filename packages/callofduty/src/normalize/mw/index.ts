import * as Match from './match'
import { Profile } from './profile'
import { Map, Maps } from './maps'
import { Mode, Modes } from './modes'
import { Weapon, Weapons } from './weapons'
import { Killstreak, Killstreaks, KillstreakObjective } from './killstreaks'

// https://my.callofduty.com/content/atvi/callofduty/mycod/web/en/data/json/iq-content-xweb.js // map, mode, weapon names
// https://my.callofduty.com/api/papi-client/ce/v1/title/mw/platform/battle/match/8944019869464002060/matchMapEvents // heatmap

namespace WZ {
    export const CircleTimes = [
        // Circle 1 - 4m 30s time before Circle starts to close. Then 4m 30s for the circle to shrink
        {
            circleId: 1,
            duration: 4.5 * 60,
            durationGas: 4.5 * 60,
        },
        // Circle 2 - 1m 30s time before Circle starts to close. Then 2m 30s for the circle to shrink
        {
            circleId: 2,
            duration: 1.5 * 60,
            durationGas: 2.5 * 60,
        },
        // Circle 3 - 1m 15s time before Circle starts to close. Then 2m 00s for the circle to shrink
        {
            circleId: 3,
            duration: 1.25 * 60,
            durationGas: 2.0 * 60,
        },
        // Circle 4 - 1m 00s time before Circle starts to close. Then 1m 30s for the circle to shrink
        {
            circleId: 4,
            duration: 1.00 * 60,
            durationGas: 1.5 * 60,
        },
        // Circle 5 - 1m 00s time before Circle starts to close. Then 1m 00s for the circle to shrink
        {
            circleId: 5,
            duration: 1.00 * 60,
            durationGas: 1.0 * 60,
        },
        // Circle 6 - 0m 45s time before Circle starts to close. Then 0m 45s for the circle to shrink
        {
            circleId: 6,
            duration: 0.75 * 60,
            durationGas: 0.75 * 60,
        },
        // Circle 7 - 0m 30s time before Circle starts to close. Then 0m 45s for the circle to shrink
        {
            circleId: 7,
            duration: 0.5 * 60,
            durationGas: 0.75 * 60,
        },
        // Then the 8th and final circle will continue to shrink to nothing over 1m 30s
        {
            circleId: 8,
            duration: 0,
            durationGas: 0,
        },
    ]
    export const TimeToCircle = (timePlayedSeconds:number):{ circle:number, gas:boolean } => {
        let accum = 0
        for(const circle of CircleTimes) {
            accum += circle.duration
            if (accum >= timePlayedSeconds) {
                return { circle: circle.circleId, gas: false }
            }
            accum += circle.durationGas
            if (accum >= timePlayedSeconds) {
                return { circle: circle.circleId, gas: true }
            }
        }
        return { circle: 8, gas: true }
    }
    export const CircleToTime = (cId:number):{ prevGas:number, circleStart:number, nextGas:number } => {
        let accum = 0
        for(const { circleId, duration, durationGas } of CircleTimes) {
            if (circleId === cId) {
                return { prevGas: accum, circleStart: accum + duration, nextGas: accum + duration + durationGas }
            }
            accum += duration
            accum += durationGas
        }
        return null
    }
}

export {
    WZ,
    Match,
    Profile,
    Map, Maps,
    Mode, Modes,
    Weapon, Weapons,
    Killstreak, Killstreaks, KillstreakObjective,
}
