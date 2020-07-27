import * as MW from './mw'

export { MW }
export type Mode = 'mp' | 'wz'
export type Game = 'mw' | 'bo4' | 'wwii'
export type Platform = 'uno' | 'battle' | 'psn' | 'xbl' | 'steam'
export interface Tokens {
    sso: string
    xsrf: string
    atkn: string
}
// Everything else is route response schemas
export interface Identity {
    titleIdentities: {
        title: string // game name eg: bo4 / mw
        platform: Platform
        username: string
        activeDate: number
        activityType: 'wz'
    }[]
}
export interface Platforms {
    [key: string]: { // key is platform
        username: string
    }
}
export interface Friends {
    uno: Friend[]
    incomingInvitations: Friend[]
    outgoingInvitations: Friend[]
    blocked: Friend[]
    firstParty: {
        xbl: {
            username: string
            platform: Platform
            avatarUrlLarge: string
            avatarUrlLargeSsl: string
            status: {
                online: boolean
            }
            identities?: {
                uno: {
                    username: string
                    platform: Platform
                    accountId: string
                }
            }
        }[]
    }
}
export interface Friend {
    username: string
    platform: Platform
    accountId: string
    status: {
        online: boolean
        curentTitleId?: 'mw' | 'bo4' // only in the "friends" and "firstParty" it seems
    }
}
export interface Loadout {
    primaryWeapon: Loadout.Weapon
    secondaryWeapon: Loadout.Weapon
    perks: { name: string }[]
    extraPerks: { name: string }[]
    killstreaks: { name: string }[]
    tactical: { name: string }
    lethal: { name: string }
}
export namespace Loadout {
    export interface Weapon {
        name: string
        label: string
        imageLoot: string
        imageIcon: string
        variant: string
        attachments: Weapon.Attachment[]
    }
    export namespace Weapon {
        export interface Attachment {
            name: string
            label: string
            image: string
        }
    }
}

export interface Match {
    utcStartSeconds: number
    utcEndSeconds: number
    map: string
    mode: string
    matchID: string
    privateMatch: boolean
    duration: number
    playlistName: string
    version: number
    gameType: Mode
}

export interface Player {
    team: string
    rank: number
    awards: {}
    username: string
    clantag: string
    uno: string
    loadout: Loadout[]
}

export interface PlayerStats {
    rank: number
    kills: number
    deaths: number
    kdRatio: number
    headshots: number
    assists: number
    executions: number
    wallBangs?: number
    nearmisses?: number
    damageDone: number
    damageTaken: number
    longestStreak: number
    scorePerMinute: number
    percentTimeMoving: number
    distanceTraveled: number
    timePlayed: number
    score: number
    miscXp: number
    medalXp: number
    matchXp: number
    scoreXp: number
    totalXp: number
}
