const objHash = require('object-hash')
import { Schema } from 'callofduty'

export const stat = (stats: any, stat: string) => stats && !isNaN(Number(stats[stat])) ? Number(stats[stat]) : 0
export const loadouts = ({ player: { loadout }, matchID }:Schema.MW.Match.MP, accountId:string) => loadout.map(loadout => ({
    accountId,
    matchId: matchID,
    hashId: `${matchID}.${accountId}.${objHash(loadout)}`,
    pwId: loadout.primaryWeapon.name,
    pwVariant: Number(loadout.primaryWeapon.variant),
    pwAttachments: loadout.primaryWeapon.attachments.filter(a => a.name !== 'none').map(a => a.name),
    swId: loadout.secondaryWeapon.name,
    swVariant: Number(loadout.secondaryWeapon.variant),
    swAttachments: loadout.secondaryWeapon.attachments.filter(a => a.name !== 'none').map(a => a.name),
    lethal: loadout.lethal.name,
    tactical: loadout.tactical.name,
    perks: loadout.perks.filter(p => p.name !== 'specialty_null').map(perk => perk.name),
    killstreaks: loadout.killstreaks.filter(ks => ks.name !== 'none').map(ks => ks.name),
}))
