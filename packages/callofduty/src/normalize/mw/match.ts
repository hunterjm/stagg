import { Schema } from '../..'
import * as MP from './match.mp'
import * as WZ from './match.wz'

export const Record = (match:Schema.API.MW.Match):Schema.DB.MW.Match.Record => {
    switch(match.gameType) {
        case 'wz':
            return WZ.Record(match)
        case 'mp':
            return MP.Record(match)
        default:
            return null
    }
}

export const Details = (match:Schema.API.MW.Routes.MatchDetails):Schema.DB.MW.Match.Details => {
    if (!match.allPlayers) {
        return null
    }
    const [first] = match.allPlayers
    switch(first.gameType) {
        case 'wz':
            return WZ.Details(match)
        case 'mp':
            return MP.Details(match)
        default:
            return null
    }
}

export const Stat = (stats: any, stat: string) => stats && !isNaN(Number(stats[stat])) ? Number(stats[stat]) : 0
export const Loadout = (loadout: Schema.API.MW.Loadout):Schema.DB.MW.Loadout => ({
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

