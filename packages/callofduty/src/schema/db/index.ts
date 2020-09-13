import * as Mongo from 'mongodb'
import * as API from '../api'
import * as MW from './mw'

export { MW }

export interface Account extends Account.Scaffold {
    _id: Mongo.ObjectID
    games: API.Game[]
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
    export type Origin = 'self' | 'kgp' | 'friend' | 'enemy' | 'random'
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
        origin: Origin
        email?: string // only for origin:self
        profiles?: Account.Profiles // only for origin:!self, otherwise populated by scraper
    }
}
