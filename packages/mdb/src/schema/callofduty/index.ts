import * as Mongo from 'mongodb'
import { Schema } from '@stagg/callofduty'
import * as MW from './mw'

export { MW }
export interface Account extends Account.Scaffold {
    _id: Mongo.ObjectID
    games: Schema.API.Game[]
    profiles: Account.Profiles
    scrape: {
        updated?: number
        rechecked?: number
        initialized?: number
        bo4?: {
            mp?: Account.Scraper
            wz?: Account.Scraper
        }
        mw?: {
            mp?: Account.Scraper
            wz?: Account.Scraper
        }
    }
    prev: {
        auth: []
        email: []
        discord: []
    }
    initFailure?: boolean // true if titleIdentities was blank on init
}
export namespace Account {
    export interface Auth {
        sso: string
        xsrf: string
        atkn: string
    }
    export interface Scraper {
        updated: number
        failures: number
        timestamp: number
    }
    export interface Profiles {
        id?: string // uno id
        uno: string
        battle?: string
        xbl?: string
        psn?: string
        steam?: string
    }
    export interface Scaffold {
        auth: Auth
        origin: 'self' | 'kgp' | 'friend' | 'enemy' | 'random'
        email?: string // only for origin:self
        profiles?: Account.Profiles // only for origin:!self, otherwise populated by scraper
    }
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