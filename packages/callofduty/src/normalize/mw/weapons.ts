import { Schema } from '../..'

const image = (weaponId:Schema.API.MW.Loadout.Weapon.Name) => `https://titles.trackercdn.com/modern-warfare/db/images/icon_cac_weapon_${weaponId.replace('iw8_', '')}.png`

const Weapons:{[key:string]: Schema.Weapon} = {}
Weapons.pi_cpapa = {
    id: 'pi_cpapa',
    name: '.357',
    image: image('pi_cpapa'),
    blueprints: [],
}
Weapons.pi_decho = {
    id: 'pi_decho',
    name: '.50 GS',
    image: image('pi_decho'),
    blueprints: [],
    unlock: {
        rank: 1
    }
}
Weapons.pi_mike1911 = {
    id: 'pi_mike1911',
    name: '1911',
    image: image('pi_mike1911'),
    blueprints: [],
    unlock: {
        rank: 1
    }
}
Weapons.sh_charlie725 = {
    id: 'sh_charlie725',
    name: '725',
    image: image('sh_charlie725'),
    blueprints: [],
    unlock: {
        rank: 1
    }
}
Weapons.ar_akilo47 = {
    id: 'ar_akilo47',
    name: 'AK-47',
    image: image('ar_akilo47'),
    blueprints: [],
    unlock: {
        rank: 1
    }
}
Weapons.ar_akilo47 = {
    id: 'ar_akilo47',
    name: 'AK-47',
    image: image('ar_akilo47'),
    blueprints: [],
    unlock: {
        rank: 1
    }
}
Weapons.sm_augolf = {
    id: 'sm_augolf',
    name: 'AUG',
    image: image('sm_augolf'),
    blueprints: [],
    unlock: {
        rank: 1
    }
}
Weapons.sn_alpha50 = {
    id: 'sn_alpha50',
    name: 'AX-50',
    image: image('sn_alpha50'),
    blueprints: [],
    unlock: {
        rank: 1
    }
}
Weapons.lm_mkilo3 = {
    id: 'lm_mkilo3',
    name: 'Bruen Mk9',
    image: image('lm_mkilo3'),
    blueprints: [],
    unlock: {
        challenge: {
            objective: 'LMG kills while enemy is close to smoke',
            requirement: 3,
            games: 15,
        }
    }
}
Weapons.ar_galima = {
    id: 'ar_galima',
    name: 'CR-56 AMAX',
    image: image('ar_galima'),
    blueprints: [],
    season: 5,
    unlock: {
        battlepass: 31
    }
}
Weapons.me_soscar = {
    id: 'me_soscar',
    name: 'Combat Knife',
    image: image('me_soscar'),
    blueprints: [],
}
Weapons.sn_crossbow = {
    id: 'sn_crossbow',
    name: 'Crossbow',
    image: image('sn_crossbow'),
    blueprints: [],
}
Weapons.sn_delta = {
    id: 'sn_delta',
    name: 'Dragunov',
    image: image('sn_delta'),
    blueprints: [],
}
Weapons.me_akimboblades = {
    id: 'me_akimboblades',
    name: 'Dual Kodachis',
    image: image('me_akimboblades'),
    blueprints: [],
}
Weapons.sn_mike14 = {
    id: 'sn_mike14',
    name: 'EBR-14',
    image: image('sn_mike14'),
    blueprints: [],
}
Weapons.ar_falima = {
    id: 'ar_falima',
    name: 'FAL',
    image: image('ar_falima'),
    blueprints: [],
}
Weapons.ar_scharlie = {
    id: 'ar_scharlie',
    name: 'FN Scar 17',
    image: image('ar_scharlie'),
    blueprints: [],
}
Weapons.ar_falpha = {
    id: 'ar_falpha',
    name: 'FR 5.56',
    image: image('ar_falpha'),
    blueprints: [],
}
Weapons.sm_victor = {
    id: 'sm_victor',
    name: 'Fennec',
    image: image('sm_victor'),
    blueprints: [],
}
Weapons.ar_sierra552 = {
    id: 'ar_sierra552',
    name: 'Grau 5.56',
    image: image('ar_sierra552'),
    blueprints: [],
}
Weapons.sn_hdromeo = {
    id: 'sn_hdromeo',
    name: 'HDR',
    image: image('sn_hdromeo'),
    blueprints: [],
}
Weapons.lm_mgolf36 = {
    id: 'lm_mgolf36',
    name: 'Holger-26',
    image: image('lm_mgolf36'),
    blueprints: [],
}
Weapons.la_juliet = {
    id: 'la_juliet',
    name: 'JOKR',
    image: image('la_juliet'),
    blueprints: [],
}
Weapons.me_akimboblunt = {
    id: 'me_akimboblunt',
    name: 'Kali Sticks',
    image: image('me_akimboblunt'),
    blueprints: [],
}
Weapons.sn_kilo98 = {
    id: 'sn_kilo98',
    name: 'Kar98k',
    image: image('sn_kilo98'),
    blueprints: [],
}
Weapons.ar_kilo433 = {
    id: 'ar_kilo433',
    name: 'Kilo 141',
    image: image('ar_kilo433'),
    blueprints: [],
}
Weapons.ar_mcharlie = {
    id: 'ar_mcharlie',
    name: 'M13',
    image: image('ar_mcharlie'),
    blueprints: [],
}
Weapons.pi_papa320 = {
    id: 'pi_papa320',
    name: 'M19',
    image: image('pi_papa320'),
    blueprints: [],
}
Weapons.ar_mike4 = {
    id: 'ar_mike4',
    name: 'M4A1',
    image: image('ar_mike4'),
    blueprints: [],
}
Weapons.lm_kilo121 = {
    id: 'lm_kilo121',
    name: 'M91',
    image: image('lm_kilo121'),
    blueprints: [],
}
Weapons.lm_mgolf34 = {
    id: 'lm_mgolf34',
    name: 'MG34',
    image: image('lm_mgolf34'),
    blueprints: [],
}
Weapons.sn_sbeta = {
    id: 'sn_sbeta',
    name: 'MK2 Carbine',
    image: image('sn_sbeta'),
    blueprints: [],
}
Weapons.sm_mpapa5 = {
    id: 'sm_mpapa5',
    name: 'MP5',
    image: image('sm_mpapa5'),
    blueprints: [],
}
Weapons.sm_mpapa7 = {
    id: 'sm_mpapa7',
    name: 'MP7',
    image: image('sm_mpapa7'),
    blueprints: [],
}
Weapons.sh_romeo870 = {
    id: 'sh_romeo870',
    name: 'Model 680',
    image: image('sh_romeo870'),
    blueprints: [],
}
Weapons.ar_asierra12 = {
    id: 'ar_asierra12',
    name: 'Oden',
    image: image('ar_asierra12'),
    blueprints: [],
}
Weapons.sh_oscar12 = {
    id: 'sh_oscar12',
    name: 'Origin 12 Shotgun',
    image: image('sh_oscar12'),
    blueprints: [],
}
Weapons.sm_papa90 = {
    id: 'sm_papa90',
    name: 'P90',
    image: image('sm_papa90'),
    blueprints: [],
}
Weapons.la_gromeo = {
    id: 'la_gromeo',
    name: 'PILA',
    image: image('la_gromeo'),
    blueprints: [],
}
Weapons.lm_pkilo = {
    id: 'lm_pkilo',
    name: 'PKM',
    image: image('lm_pkilo'),
    blueprints: [],
}
Weapons.sm_beta = {
    id: 'sm_beta',
    name: 'PP19 Bizon',
    image: image('sm_beta'),
    blueprints: [],
}
Weapons.sh_dpapa12 = {
    id: 'sh_dpapa12',
    name: 'R9-0 Shotgun',
    image: image('sh_dpapa12'),
    blueprints: [],
}
Weapons.ar_tango21 = {
    id: 'ar_tango21',
    name: 'RAM-7',
    image: image('ar_tango21'),
    blueprints: [],
}
Weapons.la_rpapa7 = {
    id: 'la_rpapa7',
    name: 'RPG-7',
    image: image('la_rpapa7'),
    blueprints: [],
}
Weapons.pi_mike9 = {
    id: 'pi_mike9',
    name: 'Renetti',
    image: image('pi_mike9'),
    blueprints: [],
}
Weapons.me_riotshield = {
    id: 'me_riotshield',
    name: 'Riot Shield',
    image: image('me_riotshield'),
    blueprints: [],
}
Weapons.sn_xmike109 = {
    id: 'sn_xmike109',
    name: 'Rytec AMR',
    image: image('sn_xmike109'),
    blueprints: [],
}
Weapons.lm_lima86 = {
    id: 'lm_lima86',
    name: 'SA87',
    image: image('lm_lima86'),
    blueprints: [],
}
Weapons.sn_sksierra = {
    id: 'sn_sksierra',
    name: 'SKS',
    image: image('sn_sksierra'),
    blueprints: [],
}
Weapons.la_kgolf = {
    id: 'la_kgolf',
    name: 'Strela-P',
    image: image('la_kgolf'),
    blueprints: [],
}
Weapons.sm_smgolf45 = {
    id: 'sm_smgolf45',
    name: 'Striker 45',
    image: image('sm_smgolf45'),
    blueprints: [],
}
Weapons.sm_uzulu = {
    id: 'sm_uzulu',
    name: 'Uzi',
    image: image('sm_uzulu'),
    blueprints: [],
}
Weapons.sh_mike26 = {
    id: 'sh_mike26',
    name: 'VLK Rogue',
    image: image('sh_mike26'),
    blueprints: [],
}
Weapons.pi_golf21 = {
    id: 'pi_golf21',
    name: 'X16',
    image: image('pi_golf21'),
    blueprints: [],
}

const Weapon = (weaponId:Schema.API.MW.Loadout.Weapon.Name) => Weapons[weaponId]

export { Weapons, Weapon }



const WeaponsRaw = {
    "arsenal:weapons_equip_gas_grenade:1": "Gas Grenade",
    "arsenal:weapons_equip_snapshot_grenade:1": "Snapshot Grenade",
    "arsenal:weapons_equip_decoy:1": "Decoy Grenade",
    "arsenal:weapons_equip_smoke:1": "Smoke Grenade",
    "arsenal:weapons_equip_concussion:1": "Stun Grenade",
    "arsenal:weapons_equip_hb_sensor:1": "Heartbeat Sensor",
    "arsenal:weapons_equip_flash:1": "Flash Grenade",
    "arsenal:weapons_equip_adrenaline:1": "Stim",
    "arsenal:weapons_equip_frag:1": "Frag Grenade",
    "arsenal:weapons_equip_thermite:1": "Thermite",
    "arsenal:weapons_equip_semtex:1": "Semtex",
    "arsenal:weapons_equip_claymore:1": "Claymore",
    "arsenal:weapons_equip_c4:1": "C4",
    "arsenal:weapons_equip_at_mine:1": "Proximity Mine",
    "arsenal:weapons_equip_throwing_knife:1": "Throwing Knife",
    "arsenal:weapons_equip_molotov:1": "Molotov Cocktail",
    "arsenal:weapons_iw8_knife:1": "Combat Knife",
    "arsenal:weapon_other:1": "Primary Melee",
    "arsenal:weapons_iw8_me_akimboblunt:1": "Kali Sticks",
    "arsenal:weapons_iw8_ar_anovember94:1": "AN-94",
    "arsenal:weapons_iw8_sm_charlie9:1": "ISO",
    "arsenal:weapons_iw8_me_akimboblades:1": "Dual Kodachis",
    "arsenal:weapons_iw8_lm_sierrax:1": "FiNN",
}