import * as Schema from '..'
import * as MP from './mp'
import * as WZ from './wz'

export { MP, WZ }
export namespace Routes {
    export interface Identity {
        titleIdentities: {
            title: string // game name eg: bo4 / mw
            platform: Schema.Platform
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
                platform: Schema.Platform
                avatarUrlLarge: string
                avatarUrlLargeSsl: string
                status: {
                    online: boolean
                }
                identities?: {
                    uno: {
                        username: string
                        platform: Schema.Platform
                        accountId: string
                    }
                }
            }[]
        }
    }
    export interface Matches {
        summary: Summary,
        matches: Match[]
    }
    export interface Profile {

    }
}

export type Map = MP.Map | WZ.Map
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
        name: Weapon.Name
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
        export type Name = 
            // pistols
            'pi_cpapa' | 'pi_decho' | 'pi_mike1911' | 'pi_papa320' | 'pi_mike9' | 'pi_golf21' |
            // shotguns
            'sh_charlie725' | 'sh_romeo870' | 'sh_oscar12' | 'sh_dpapa12' | 'sh_mike26' |
            // submachine guns
            'sm_augolf' | 'sm_victor' | 'sm_mpapa5' | 'sm_mpapa7' | 'sm_papa90' | 'sm_beta' | 'sm_smgolf45' | 'sm_uzulu' |
            // assault rifles
            'ar_akilo47' | 'ar_galima' | 'ar_falima' | 'ar_scharlie' | 'ar_falpha' | 'ar_sierra552' | 'ar_kilo433' | 'ar_mcharlie' |
            'ar_mike4' | 'ar_asierra12' | 'ar_tango21' |
            // light machineguns
            'lm_mkilo3' | 'lm_mgolf36' | 'lm_kilo121' | 'lm_mgolf34' | 'lm_pkilo' | 'lm_lima86' |
            // sniper/marksman rifles
            'sn_alpha50' | 'sn_crossbow' | 'sn_delta' | 'sn_mike14' | 'sn_hdromeo' | 'sn_kilo98' | 'sn_sbeta' | 'sn_xmike109' | 'sn_sksierra' |
            // launchers
            'la_juliet' | 'la_gromeo' | 'la_rpapa7' | 'la_kgolf' |
            // melee/misc
            'me_soscar' | 'me_akimboblades' | 'me_akimboblunt' | 'me_riotshield'
    }
}

export type Summary = WZ.Summary
export type Match = MP.Match | WZ.Match
export namespace Match {
    export type Mode = MP.Match.Mode | WZ.Match.Mode
    export interface Common {
        utcStartSeconds: number
        utcEndSeconds: number
        map: Map
        mode: Match.Mode
        matchID: string
        privateMatch: boolean
        duration: number
        playlistName: string
        version: number
        gameType: Schema.GameType
    }
}
export namespace Killstreak {
    export type Name = 'radar_drone_overwatch' | 'manual_turret' | 'scrambler_drone_guard' | 'uav' | 'airdrop' |
        'toma_strike' | 'cruise_predator' | 'precision_airstrike' | 'bradley' | 'sentry_gun' | 'pac_sentry' |
        'airdrop_multiple' | 'hover_jet' | 'white_phosphorus' | 'chopper_gunner' | 'chopper_support' | 
        'gunship' | 'directional_uav' | 'juggernaut' | 'nuke'
}
// Everything else is route response schemas
export interface Friend {
    username: string
    platform: Schema.Platform
    accountId: string
    status: {
        online: boolean
        curentTitleId?: 'mw' | 'bo4' // only in the "friends" and "firstParty" it seems
    }
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
