import { CallOfDuty } from '@stagg/db'
import { Schema } from 'callofduty'


/************************************************************************************************************
 * Modern Warfare - Multiplayer - Match Player Killstreak Stats
 ***********************************************************************************************************/
export const MwMpMatchLoadoutNormalizer = ({ player: { loadout } }:Schema.MW.Match.MP, account:CallOfDuty.Account.Base.Entity, detail:CallOfDuty.Match.MW.MP.Detail.Entity):Partial<CallOfDuty.Match.MW.MP.Loadout.Entity>[] => loadout.map(loadout => ({
    match: detail,
    account,
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
} as CallOfDuty.Match.MW.MP.Loadout.Entity))
