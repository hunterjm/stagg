import { Map, Maps } from './maps'
import { Mode, Modes } from './modes'
import { Weapon, Weapons } from './weapons'
import { Killstreak, Killstreaks, KillstreakObjective } from './killstreaks'

// https://my.callofduty.com/content/atvi/callofduty/mycod/web/en/data/json/iq-content-xweb.js // map, mode, weapon names
// https://my.callofduty.com/api/papi-client/ce/v1/title/mw/platform/battle/match/8944019869464002060/matchMapEvents // heatmap

namespace WZ {
    export const Circle = (timePlayedSeconds:number):{ circle:number, gas:boolean } => {
        // Circle 1 - 4m 30s time before Circle starts to close. Then 4m 30s for the circle to shrink
        if (timePlayedSeconds < 4.5 * 60)   return { circle: 1, gas: false }
        if (timePlayedSeconds < 9 * 60)     return { circle: 1, gas: true }
        // Circle 2 - 1m 30s time before Circle starts to close. Then 2m 30s for the circle to shrink
        if (timePlayedSeconds < 10.5 * 60)  return { circle: 2, gas: false }
        if (timePlayedSeconds < 13 * 60)    return { circle: 2, gas: true }
        // Circle 3 - 1m 15s time before Circle starts to close. Then 2m 00s for the circle to shrink
        if (timePlayedSeconds < 14.25 * 60) return { circle: 3, gas: false }
        if (timePlayedSeconds < 16.25 * 60) return { circle: 3, gas: true }
        // Circle 4 - 1m 00s time before Circle starts to close. Then 1m 30s for the circle to shrink
        if (timePlayedSeconds < 17.25 * 60) return { circle: 4, gas: false }
        if (timePlayedSeconds < 18.75 * 60) return { circle: 4, gas: true }
        // Circle 5 - 1m 00s time before Circle starts to close. Then 1m 00s for the circle to shrink
        if (timePlayedSeconds < 19.75 * 60) return { circle: 5, gas: false }
        if (timePlayedSeconds < 20.75 * 60) return { circle: 5, gas: true }
        // Circle 6 - 0m 45s time before Circle starts to close. Then 0m 45s for the circle to shrink
        if (timePlayedSeconds < 21.5 * 60)  return { circle: 6, gas: false }
        if (timePlayedSeconds < 22.25 * 60) return { circle: 6, gas: true }
        // Circle 7 - 0m 30s time before Circle starts to close. Then 0m 45s for the circle to shrink
        if (timePlayedSeconds < 22.75 * 60) return { circle: 7, gas: false }
        if (timePlayedSeconds < 23.5 * 60)  return { circle: 7, gas: true }
        // Then the 8th and final circle will continue to shrink to nothing over 1m 30s
        return { circle: 8, gas: true }
    }
}

export {
    WZ,
    Map, Maps,
    Mode, Modes,
    Weapon, Weapons,
    Killstreak, Killstreaks, KillstreakObjective,
}
