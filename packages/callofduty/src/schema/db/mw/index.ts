import * as API from '../../api'

export interface Match {
    matchId: string
    mapId: API.MW.Map
    modeId: API.MW.Match.Mode
    startTime: number
    endTime: number
}
export interface Performance {
    matchId: string
    mapId: API.MW.Map
    modeId: API.MW.Match.Mode
    startTime: number
    endTime: number
}
export interface Loadout {
    primary: Loadout.Weapon
    secondary: Loadout.Weapon
    lethal: string
    tactical: string
    perks: string[]
    killstreaks: string[]
}
export namespace Loadout {
    export interface Weapon {
        weapon: string
        variant: number
        attachments: string[]
    }
}
