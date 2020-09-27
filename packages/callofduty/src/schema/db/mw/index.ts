import * as MP from './mp'
import * as WZ from './wz'

export { MP, WZ }

export namespace Match {
    export type Details = WZ.Match.Details
    export type Record = MP.Match.Record | WZ.Match.Record
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

export interface Profile {
    total: {
        kills: number
        deaths: number
        suicides: number
        headshots: number
        assists: number
        games: number
        wins: number
        ties: number
        losses: number
        score: number
        timePlayed: number
        shots: {
            hit: number
            miss: number
        }
    }
    best: {
        kdr: number
        spm: number
        score: number
        kills: number
        deaths: number
        assists: number
        stabs: number
        damage: number
        winstreak: number
        killstreak: number
        killchains: number
        infectedKills: number
        survivorKills: number
        confirmed: number
        denied: number
        captures: number
        defends: number
        plants: number
        defuses: number
        destructions: number
        setbacks: number
        rescues: number
        returns: number
        touchdowns: number
        fieldGoals: number
        xp: {
            total: number
            match: number
            score: number
            medal: number
            bonus: number
        }
    }
    modes: {
        [key:string]: {
            timePlayed: number
            score: number
            kills: number
            deaths: number
            
            stabs?: number
            setBacks?: number

            gamesPlayed?: number
            wins?: number
            downs?: number
            revives?: number
            contracts?: number
            cash?: number
        }
    }
    weapons: {
        [key:string]: {
            kills: number
            deaths: number
            headshots: number
            shots: {
                hit: number
                miss: number
            }
        }
    }
    equipment: {
        lethal: {
            [key:string]: {
                kills: number
                deaths: number
                headshots: number
                shots: {
                    hit: number
                    miss: number
                }
            }
        }
        tactical: {
            [key:string]: {
                kills: number
                deaths: number
                headshots: number
                shots: {
                    hit: number
                    miss: number
                }
            }
        }
    },
    killstreaks: {
        [key:string]: {
            uses: number
            awarded: number

            kills?: number
            assists?: number
        }
    }
}
