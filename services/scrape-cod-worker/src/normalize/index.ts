import { Schema } from '@stagg/callofduty'
import * as MDB from '@stagg/mdb'
import * as MW from './mw'

export { MW }
export const Stat = (stats: any, stat: string) => stats && !isNaN(Number(stats[stat])) ? Number(stats[stat]) : 0
export const Loadout = (loadout: Schema.API.MW.Loadout):MDB.Schema.CallOfDuty.Loadout => ({
    primary: {
        weapon: loadout.primaryWeapon.name,
        variant: Number(loadout.primaryWeapon.variant),
        attachments: loadout.primaryWeapon.attachments.filter(a => a.name !== 'none').map(a => a.name),
    },
    secondary: {
        weapon: loadout.secondaryWeapon.name,
        variant: Number(loadout.secondaryWeapon.variant),
        attachments: loadout.secondaryWeapon.attachments.filter(a => a.name !== 'none').map(a => a.name),
    },
    lethal: loadout.lethal.name,
    tactical: loadout.tactical.name,
    perks: loadout.perks.filter(p => p.name !== 'specialty_null').map(perk => perk.name),
    killstreaks: loadout.killstreaks.filter(ks => ks.name !== 'none').map(ks => ks.name),
})
