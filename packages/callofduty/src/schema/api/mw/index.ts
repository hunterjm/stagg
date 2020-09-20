import * as Schema from '..'
import * as MP from './mp'
import * as WZ from './wz'

export { MP, WZ }

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
        curentTitleId?: 'mw' | 'bo4' // only in the friends and firstParty it seems
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
        title: 'mw'
        platform: Schema.Platform
        username: string
        type: 'mp' | 'wz'
        level: number
        maxLevel: number
        levelXpRemainder: number
        levelXpGained: number
        prestige: number
        prestigeId: number
        maxPrestige: number
        totalXp: number
        paragonRank: number
        paragonId: number
        s: number
        p: number
        weekly: Profile.Weekly
        lifetime: Profile.Lifetime
    }
    export namespace Profile {
        export type Properties<T> = { properties: T }
        export interface Weekly {
            map: {}
            mode: any // mapped inside mp/wz extensions
            all: Profile.Properties.All
        }
        export interface Lifetime extends Weekly {
            itemData: Profile.ItemData
        }
        export namespace Properties {
            export interface All {
                recordLongestWinStreak: number
                recordXpInAMatch: number
                accuracy: number
                losses: number
                totalGamesPlayed: number
                score: number
                winLossRatio: number
                totalShots: number
                bestScoreXp: number
                gamesPlayed: number
                bestSquardKills: number
                bestSguardWave: number
                bestConfirmed: number
                deaths: number
                wins: number
                bestSquardCrates: number
                kdRatio: number
                bestAssists: number
                bestFieldgoals: number
                bestScore: number
                recordDeathsInAMatch: number
                scorePerGame: number
                bestSPM: number
                bestKillChains: number
                recordKillsInAMatch: number
                suicides: number
                wlRatio: number
                currentWinStreak: number
                bestMatchBonusXp: number
                bestMatchXp: number
                bestSguardWeaponLevel: number
                bestKD: number
                kills: number
                bestKillsAsInfected: number
                bestReturns: number
                bestStabs: number
                bestKillsAsSurvivor: number
                timePlayedTotal: number
                bestDestructions: number
                headshots: number
                bestRescues: number
                assists: number
                ties: number
                recordKillStreak: number
                bestPlants: number
                misses: number
                bestDamage: number
                bestSetbacks: number
                bestTouchdowns: number
                scorePerMinute: number
                bestDeaths: number
                bestMedalXp: number
                bestDefends: number
                bestSquardRevives: number
                bestKills: number
                bestDefuses: number
                bestCaptures: number
                hits: number
                bestKillStreak: number
                bestDenied: number
            }
            export interface Equipment {
                hits: number
                kills: number
                shots: number
                deaths: number
                headShots: number
            }
            export interface Weapon extends Equipment {
                kdRatio: number
                accuracy: number
            }
        }
        export interface ItemData {
            lethals: {
                equip_c4: Profile.Properties<Profile.Properties.Equipment>
                equip_frag: Profile.Properties<Profile.Properties.Equipment>
                equip_semtex: Profile.Properties<Profile.Properties.Equipment>
                equip_at_mine: Profile.Properties<Profile.Properties.Equipment>
                equip_molotov: Profile.Properties<Profile.Properties.Equipment>
                equip_claymore: Profile.Properties<Profile.Properties.Equipment>
                equip_thermite: Profile.Properties<Profile.Properties.Equipment>
                equip_throwing_knife: Profile.Properties<Profile.Properties.Equipment>
            }
            tacticals: {
                equip_decoy: Profile.Properties<Profile.Properties.Equipment>
                equip_smoke: Profile.Properties<Profile.Properties.Equipment>
                equip_flash: Profile.Properties<Profile.Properties.Equipment>
                equip_hb_sensor: Profile.Properties<Profile.Properties.Equipment>
                equip_concussion: Profile.Properties<Profile.Properties.Equipment>
                equip_adrenaline: Profile.Properties<Profile.Properties.Equipment>
                equip_gas_grenade: Profile.Properties<Profile.Properties.Equipment>
                equip_snapshot_grenade: Profile.Properties<Profile.Properties.Equipment>
            }
            weapon_smg: {
                iw8_sm_mpapa7: Profile.Properties<Profile.Properties.Weapon>
                iw8_sm_augolf: Profile.Properties<Profile.Properties.Weapon>
                iw8_sm_papa90: Profile.Properties<Profile.Properties.Weapon>
                iw8_sm_charlie9: Profile.Properties<Profile.Properties.Weapon>
                iw8_sm_mpapa5: Profile.Properties<Profile.Properties.Weapon>
                iw8_sm_smgolf45: Profile.Properties<Profile.Properties.Weapon>
                iw8_sm_beta: Profile.Properties<Profile.Properties.Weapon>
                iw8_sm_victor: Profile.Properties<Profile.Properties.Weapon>
                iw8_sm_uzulu: Profile.Properties<Profile.Properties.Weapon>
            }
            weapon_lmg: {
                iw8_lm_kilo121: Profile.Properties<Profile.Properties.Weapon>
                iw8_lm_mkilo3: Profile.Properties<Profile.Properties.Weapon>
                iw8_lm_mgolf34: Profile.Properties<Profile.Properties.Weapon>
                iw8_lm_lima86: Profile.Properties<Profile.Properties.Weapon>
                iw8_lm_pkilo: Profile.Properties<Profile.Properties.Weapon>
                iw8_lm_sierrax: Profile.Properties<Profile.Properties.Weapon>
                iw8_lm_mgolf36: Profile.Properties<Profile.Properties.Weapon>
            }
            weapon_melee: {
                iw8_knife: Profile.Properties<Profile.Properties.Weapon>
                iw8_me_akimboblunt: Profile.Properties<Profile.Properties.Weapon>
                iw8_me_akimboblades: Profile.Properties<Profile.Properties.Weapon>
            }
            weapon_other: {
                iw8_me_riotshield: Profile.Properties<Profile.Properties.Weapon>
            }
            weapon_pistol: {
                iw8_pi_cpapa: Profile.Properties<Profile.Properties.Weapon>
                iw8_pi_mike9: Profile.Properties<Profile.Properties.Weapon>
                iw8_pi_mike1911: Profile.Properties<Profile.Properties.Weapon>
                iw8_pi_golf21: Profile.Properties<Profile.Properties.Weapon>
                iw8_pi_decho: Profile.Properties<Profile.Properties.Weapon>
                iw8_pi_papa320: Profile.Properties<Profile.Properties.Weapon>
            }
            weapon_sniper: {
                iw8_sn_alpha50: Profile.Properties<Profile.Properties.Weapon>
                iw8_sn_hdromeo: Profile.Properties<Profile.Properties.Weapon>
                iw8_sn_delta: Profile.Properties<Profile.Properties.Weapon>
                iw8_sn_xmike109: Profile.Properties<Profile.Properties.Weapon>
            }
            weapon_shotgun: {
                iw8_sh_mike26: Profile.Properties<Profile.Properties.Weapon>
                iw8_sh_charlie725: Profile.Properties<Profile.Properties.Weapon>
                iw8_sh_oscar12: Profile.Properties<Profile.Properties.Weapon>
                iw8_sh_romeo870: Profile.Properties<Profile.Properties.Weapon>
                iw8_sh_dpapa12: Profile.Properties<Profile.Properties.Weapon>
            }
            weapon_launcher: {
                iw8_la_gromeo: Profile.Properties<Profile.Properties.Weapon>
                iw8_la_rpapa7: Profile.Properties<Profile.Properties.Weapon>
                iw8_la_kgolf: Profile.Properties<Profile.Properties.Weapon>
                iw8_la_juliet: Profile.Properties<Profile.Properties.Weapon>
                iw8_la_mike32: Profile.Properties<Profile.Properties.Weapon>
            }
            weapon_marksman: {
                iw8_sn_sbeta: Profile.Properties<Profile.Properties.Weapon>
                iw8_sn_crossbow: Profile.Properties<Profile.Properties.Weapon>
                iw8_sn_kilo98: Profile.Properties<Profile.Properties.Weapon>
                iw8_sn_mike14: Profile.Properties<Profile.Properties.Weapon>
                iw8_sn_sksierra: Profile.Properties<Profile.Properties.Weapon>
            }
            weapon_assault_rifle: {
                iw8_ar_falima: Profile.Properties<Profile.Properties.Weapon>
                iw8_ar_tango21: Profile.Properties<Profile.Properties.Weapon>
                iw8_ar_mike4: Profile.Properties<Profile.Properties.Weapon>
                iw8_ar_anovember94: Profile.Properties<Profile.Properties.Weapon>
                iw8_ar_falpha: Profile.Properties<Profile.Properties.Weapon>
                iw8_ar_mcharlie: Profile.Properties<Profile.Properties.Weapon>
                iw8_ar_akilo47: Profile.Properties<Profile.Properties.Weapon>
                iw8_ar_kilo433: Profile.Properties<Profile.Properties.Weapon>
                iw8_ar_scharlie: Profile.Properties<Profile.Properties.Weapon>
                iw8_ar_asierra12: Profile.Properties<Profile.Properties.Weapon>
                iw8_ar_galima: Profile.Properties<Profile.Properties.Weapon>
                iw8_ar_sierra552: Profile.Properties<Profile.Properties.Weapon>
            }
        }
    }
}
