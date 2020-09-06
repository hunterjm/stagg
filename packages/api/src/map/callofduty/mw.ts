import { snakeToPascal } from '@stagg/util'

export const Img = {
    Map: {
        MiniMap(mapId:string):string {
            return `https://www.callofduty.com/cdn/app/maps/mw/compass_map_${mapId}.jpg`
        },
        Thumbnail(mapId:string):string {
            return `https://www.callofduty.com/cdn/app/base-maps/mw/${mapId}.jpg`
        }
    },
    Weapon(weaponId:string):string {
        return `https://titles.trackercdn.com/modern-warfare/db/images/icon_cac_weapon_${weaponId.replace('iw8_', '')}.png`
    }
}

export const Killstreaks = {
    radar_drone_overwatch: 'Personal Radar',
    manual_turret: 'Shield Turret',
    scrambler_drone_guard: 'Counter UAV',
    uav: 'UAV',
    airdrop: 'Care Package',
    toma_strike: 'Cluster Strike',
    cruise_predator: 'Cruise Missile',
    precision_airstrike: 'Precision Airstrike',
    bradley: 'Infantry Assault Vehicle',
    sentry_gun: 'Sentry Gun',
    pac_sentry: 'Wheelson',
    airdrop_multiple: 'Emergency Airdrop',
    hover_jet: 'VTOL Jet',
    white_phosphorus: 'White Phosphorus',
    chopper_gunner: 'Chopper Gunner',
    chopper_support: 'Support Helo',
    gunship: 'Gunship',
    directional_uav: 'Advanced UAV',
    juggernaut: 'Juggernaut',
    nuke: 'Nuke',
}

export const KillstreakKillsProp = (killstreakId:string) => `objectiveMedalScoreSsKill${snakeToPascal(killstreakId)}`
export const KillstreakTakedownsProp = (killstreakId:string) => `objectiveMedalScoreKillSs${snakeToPascal(killstreakId)}`
export const KillstreakObjectiveId = (objectiveProp:string) => 
    objectiveProp.replace('objectiveMedalScoreSsKill', '').replace('objectiveMedalScoreKillSs', '').match(/[A-Z]*[^A-Z]+/g).map(s => s.toLowerCase()).join('_')

export const Modes = {
    br_87:                  { type: 'br', teamSize: 1, lobbySize: 150, name: 'BR Solos' },
    br_71:                  { type: 'br', teamSize: 1, lobbySize: 150, name: 'BR Solos' },
    br_brsolo:              { type: 'br', teamSize: 1, lobbySize: 150, name: 'BR Solos' },
    br_88:                  { type: 'br', teamSize: 2, lobbySize: 150, name: 'BR Duos' },
    br_brduos:              { type: 'br', teamSize: 2, lobbySize: 150, name: 'BR Duos' },
    br_74:                  { type: 'br', teamSize: 3, lobbySize: 150, name: 'BR Trios' },
    br_77:                  { type: 'br', teamSize: 3, lobbySize: 150, name: 'BR Trios' },
    br_25:                  { type: 'br', teamSize: 3, lobbySize: 150, name: 'BR Trios' },
    br_brtrios:             { type: 'br', teamSize: 3, lobbySize: 150, name: 'BR Trios' },
    br_jugg_brtriojugr:     { type: 'br', teamSize: 3, lobbySize: 150, name: 'BR Juggernaut Trios' }, // juggernaut drops in trios
    br_brtriostim_name2:    { type: 'br', teamSize: 3, lobbySize: 150, name: 'BR Stikmulus Trios' }, // auto respawn if >$4500
    br_89:                  { type: 'br', teamSize: 4, lobbySize: 150, name: 'BR Quads' },
    br_brquads:             { type: 'br', teamSize: 4, lobbySize: 150, name: 'BR Quads' },
    br_86:                  { type: 'br', teamSize: 4, lobbySize: 150, realism: true, name: 'BR Realism Quads' },
    br_br_real:             { type: 'br', teamSize: 4, lobbySize: 150, realism: true, name: 'BR Realism Quads' },
    br_brthquad:            { type: 'br', teamSize: 4, lobbySize: 200, name: 'BR Quads 200' },
    br_mini_miniroyale:     { type: 'br_mini', teamSize: 3, lobbySize: 75, name: 'Mini Royale' },
    brtdm_rmbl:             { type: 'br_tdm', teamSize: 6, lobbySize: 150, name: 'Warzone Rumble' },
    br_dmz_38:              { type: 'plunder', teamSize: 3, lobbySize: 150, name: 'Plunder' },
    br_dmz_76:              { type: 'plunder', teamSize: 4, lobbySize: 150, name: 'Plunder' },
    br_dmz_85:              { type: 'plunder', teamSize: 4, lobbySize: 150, name: 'Plunder' },
    br_dmz_104:             { type: 'plunder', teamSize: 4, lobbySize: 150, name: 'Plunder' },
    arm:                    { type: 'mp', teamSize: 4, lobbySize: 64, name: 'Ground War' },
    war:                    { type: 'mp', teamSize: 6, lobbySize: 12, name: 'Team Deathmatch' },
    gun:                    { type: 'mp', teamSize: 3, lobbySize: 12, name: 'Gun Game' },
    dom:                    { type: 'mp', teamSize: 6, lobbySize: 12, name: 'Domination' },
    conf:                   { type: 'mp', teamSize: 6, lobbySize: 12, name: 'Kill Confirmed' },
    koth:                   { type: 'mp', teamSize: 6, lobbySize: 12, name: 'Hardpoint' },
    hq:                     { type: 'mp', teamSize: 6, lobbySize: 12, name: 'Headquarters' },
    dd:                     { type: 'mp', teamSize: 6, lobbySize: 12, name: 'Demolition' },
    sd:                     { type: 'mp', teamSize: 6, lobbySize: 12, name: 'Search + Destroy' },
    cyber:                  { type: 'mp', teamSize: 6, lobbySize: 12, name: 'Cyber Attack' },
    arena:                  { type: 'mp', teamSize: 2, lobbySize: 4, name: 'Gunfight' },
    // hc_* appears in profile endpoint and *_hc appears in matches so mapping both
    hc_dd:                  { type: 'mp', teamSize: 6, lobbySize: 12, hardcore: true, name: 'Hardcore Demolition' },
    dd_hc:                  { type: 'mp', teamSize: 6, lobbySize: 12, hardcore: true, name: 'Hardcore Demolition' },
    hc_hq:                  { type: 'mp', teamSize: 6, lobbySize: 12, hardcore: true, name: 'Hardcore Headquarters' },
    hq_hc:                  { type: 'mp', teamSize: 6, lobbySize: 12, hardcore: true, name: 'Hardcore Headquarters' },
    hc_sd:                  { type: 'mp', teamSize: 6, lobbySize: 12, hardcore: true, name: 'Hardcore Search + Destroy' },
    sd_hc:                  { type: 'mp', teamSize: 6, lobbySize: 12, hardcore: true, name: 'Hardcore Search + Destroy' },
    hc_dom:                 { type: 'mp', teamSize: 6, lobbySize: 12, hardcore: true, name: 'Hardcore Domination' },
    dom_hc:                 { type: 'mp', teamSize: 6, lobbySize: 12, hardcore: true, name: 'Hardcore Domination' },
    hc_war:                 { type: 'mp', teamSize: 6, lobbySize: 12, hardcore: true, name: 'Hardcore Team Deathmatch' },
    war_hc:                 { type: 'mp', teamSize: 6, lobbySize: 12, hardcore: true, name: 'Hardcore Team Deathmatch' },
    hc_conf:                { type: 'mp', teamSize: 6, lobbySize: 12, hardcore: true, name: 'Hardcore Kill Confirmed' },
    conf_hc:                { type: 'mp', teamSize: 6, lobbySize: 12, hardcore: true, name: 'Hardcore Kill Confirmed' },
    hc_koth:                { type: 'mp', teamSize: 6, lobbySize: 12, hardcore: true, name: 'Hardcore Hardpoint' },
    koth_hc:                { type: 'mp', teamSize: 6, lobbySize: 12, hardcore: true, name: 'Hardcore Hardpoint' },
    hc_cyber:               { type: 'mp', teamSize: 6, lobbySize: 12, hardcore: true, name: 'Hardcore Cyber Attack' },
    cyber_hc:               { type: 'mp', teamSize: 6, lobbySize: 12, hardcore: true, name: 'Hardcore Cyber Attack' },
}

export const Weapons = {
    pi_cpapa: '.357',
    pi_decho: '.50 GS',
    pi_mike1911: '1911',
    sh_charlie725: '725',
    ar_akilo47: 'AK-47',
    sm_augolf: 'AUG',
    sn_alpha50: 'AX-50',
    lm_mkilo3: 'Bruen Mk9',
    ar_galima: 'CR-56 AMAX',
    me_soscar: 'Combat Knife',
    sn_crossbow: 'Crossbow',
    sn_delta: 'Dragunov',
    me_akimboblades: 'Dual Kodachis',
    sn_mike14: 'EBR-14',
    ar_falima: 'FAL',
    ar_scharlie: 'FN Scar 17',
    ar_falpha: 'FR 5.56',
    sm_victor: 'Fennec',
    ar_sierra552: 'Grau 5.56',
    sn_hdromeo: 'HDR',
    lm_mgolf36: 'Holger-26',
    la_juliet: 'JOKR',
    me_akimboblunt: 'Kali Sticks',
    sn_kilo98: 'Kar98k',
    ar_kilo433: 'Kilo 141',
    ar_mcharlie: 'M13',
    pi_papa320: 'M19',
    ar_mike4: 'M4A1',
    lm_kilo121: 'M91',
    lm_mgolf34: 'MG34',
    sn_sbeta: 'MK2 Carbine',
    sm_mpapa5: 'MP5',
    sm_mpapa7: 'MP7',
    sh_romeo870: 'Model 680',
    ar_asierra12: 'Oden',
    sh_oscar12: 'Origin 12 Shotgun',
    sm_papa90: 'P90',
    la_gromeo: 'PILA',
    lm_pkilo: 'PKM',
    sm_beta: 'PP19 Bizon',
    sh_dpapa12: 'R9-0 Shotgun',
    ar_tango21: 'RAM-7',
    la_rpapa7: 'RPG-7',
    pi_mike9: 'Renetti',
    me_riotshield: 'Riot Shield',
    sn_xmike109: 'Rytec AMR',
    lm_lima86: 'SA87',
    sn_sksierra: 'SKS',
    la_kgolf: 'Strela-P',
    sm_smgolf45: 'Striker 45',
    sm_uzulu: 'Uzi',
    sh_mike26: 'VLK Rogue',
    pi_golf21: 'X16'
}

export namespace WZ {
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
