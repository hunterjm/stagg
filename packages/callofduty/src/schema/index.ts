import * as DB from './db'
import * as API from './api'

export { DB, API }
// These are normalized object schemas
export interface Platform {
    id: API.Platform // API recognized name
    name: string // full name
    label: string // 3 letter abbr
}
export interface Map {
    id: API.MW.Map
    name: string
    games: API.Game[]
    type: 'wz' | 'mp'
    category?: 'groundwar' | 'cage'
    images: {
        minimap?: string // only available for MP maps
        thumbnail: string
    }
}
export interface Mode {
    id: API.MW.Match.Mode
    name: string
    games: API.Game[]
    teamSize: number
    lobbySize: number
    type: 'wz' | 'mp'
    category?: 'br' | 'br_mini' | 'br_tdm' | 'plunder'
    gulag?: boolean
    realism?: boolean
    hardcore?: boolean
    respawns?: boolean
    buybacks?: boolean
}
export interface Weapon {
    id: API.MW.Loadout.Weapon.Name
    name: string
    image: string
    blueprints: string[]
    season?: number
    unlock?: {
        rank?: number
        battlepass?: number
        challenge?: {
            objective: string // LMG kills while enemy is close to smoke
            requirement: number // 3 required per game
            games: number // 10 games total required for unlock
            consecutive?: boolean // true if games must be consecutive
        }
    }
}
export interface Killstreak {
    id: API.MW.Killstreak.Name
    name: string
    props: {
        kills: string
        takedowns: string
    }
    reward?: {
        kills?: number
        score?: number
    }
}

export interface Account {
    games: {
        mw?: {
            mp?: {
                profile: any
                matchIds: string[]
            }
            wz: {
                profile: any
                matchIds: string[]
            }
        }
    }
}

