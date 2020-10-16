import { Schema, Normalize } from '@stagg/callofduty'

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
export const Killstreaks = (player:Schema.API.MW.MP.Match.Player, playerStats:Schema.API.MW.MP.Match.PlayerStats):{[key:string]:Schema.DB.MW.MP.Match.Record.Stats.Killstreak} => {
    const killstreaks = {}
    for(const killstreakId in Normalize.MW.Killstreaks) {
        const { props } = Normalize.MW.Killstreak(killstreakId as Schema.API.MW.Killstreak.Name)
        killstreaks[killstreakId] = {
            uses: player.killstreakUsage[killstreakId] || 0,
            kills: playerStats[props.kills] || 0,
            takedowns: playerStats[props.takedowns] || 0,
        }
    }
    return killstreaks
}
export const Weapons = (match:Schema.API.MW.MP.Match):{[key:string]:Schema.DB.MW.MP.Match.Record.Stats.Weapon} => {
    const weapons = {}
    for (const weaponId in match.weaponStats) {
        weapons[weaponId] = {
            loadout: match.weaponStats[weaponId].loadoutIndex,
            kills: match.weaponStats[weaponId].kills,
            deaths: match.weaponStats[weaponId].deaths,
            headshots: match.weaponStats[weaponId].headshots,
            shots: {
                hit: match.weaponStats[weaponId].hits,
                miss: match.weaponStats[weaponId].shots - match.weaponStats[weaponId].hits,
            },
            xp: {
                start: match.weaponStats[weaponId].startingWeaponXp,
                earned: match.weaponStats[weaponId].xpEarned,
            },
        }
    }
    return weapons
}

export namespace MW {
    export namespace MP {
        export const Details = (match:Schema.API.MW.MP.Match) => ({
            matchId: match.matchID,
            modeId: match.mode,
            mapId: match.map,
            endTime: match.utcEndSeconds,
            startTime: match.utcStartSeconds,
        })
        export const Record = (match:Schema.API.MW.MP.Match) => ({
            matchId: match.matchID,
            modeId: match.mode,
            mapId: match.map,
            teamId: match.player.team,
            unoId: match.player.uno,
            username: match.player.username,
            clantag: match.player.clantag,
            quit: !match.isPresentAtEnd,
            seasonRank: Stat(match.playerStats, 'seasonRank'),
            score: Stat(match.playerStats, 'score'),
            scoreAxis: match.team2Score,
            scoreAllies: match.team1Score,
            kills: Stat(match.playerStats, 'kills'),
            deaths: Stat(match.playerStats, 'deaths'),
            assists: Stat(match.playerStats, 'assists'),
            suicides: Stat(match.playerStats, 'suicides'),
            executions: Stat(match.playerStats, 'executions'),
            headshots: Stat(match.playerStats, 'headshots'),
            wallBangs: Stat(match.playerStats, 'wallBangs'),
            nearMisses: Stat(match.playerStats, 'nearMisses'),
            longestStreak: Stat(match.playerStats, 'longestStreak'),
            timePlayed: Stat(match.playerStats, 'timePlayed'),
            teamPlacement: match.result === 'win' ? 1 : match.result === 'loss' ? 2 : 0,
            damageDone: Stat(match.playerStats, 'damageDone'),
            damageTaken: Stat(match.playerStats, 'damageTaken'),
            avgSpeed: Stat(match.playerStats, 'averageSpeedDuringMatch'),
            percentTimeMoving: Stat(match.playerStats, 'percentTimeMoving'),
            distanceTraveled: Stat(match.playerStats, 'distanceTraveled'),
            shotsHit: Stat(match.playerStats, 'shotsLanded'),
            shotsMiss: Stat(match.playerStats, 'shotsMissed'),
            scoreXp: Stat(match.playerStats, 'scoreXp'),
            matchXp: Stat(match.playerStats, 'matchXp'),
            medalXp: Stat(match.playerStats, 'medalXp'),
            miscXp: Stat(match.playerStats, 'miscXp'),
            totalXp: Stat(match.playerStats, 'totalXp'),
            bonusXp: Stat(match.playerStats, 'bonusXp'),
            challengeXp: Stat(match.playerStats, 'challengeXp'),
            weapons: Weapons(match),
            killstreaks: Killstreaks(match.player, match.playerStats),
            objectives: {
                // Flags, etc
                captureKill: Stat(match.playerStats, 'objectiveCaptureKill'),
                defenseKill: Stat(match.playerStats, 'objectiveObjProgDefend'),
                defendScore: Stat(match.playerStats, 'objectiveMedalModeXDefendScore'),
                assaultScore: Stat(match.playerStats, 'objectiveMedalModeXAssaultScore'),
                captureScore: Stat(match.playerStats, 'objectiveMedalModeDomSecureScore'), // dom cap
                captureScoreB: Stat(match.playerStats, 'objectiveMedalModeDomSecureBScore'), // dom cap B flag
                captureAssistScore: Stat(match.playerStats, 'objectiveMedalModeDomSecureAssistScore'), // dom cap assist
                captureNeutralScore: Stat(match.playerStats, 'objectiveMedalModeDomSecureNeutralScore'), // dom cap B flag
                // Kill Confirmed
                tagOwn: Stat(match.playerStats, 'objectiveMedalModeKcOwnTagsScore'),
                tagDeny: Stat(match.playerStats, 'objectiveKillDenied'),
                tagConfirm: Stat(match.playerStats, 'objectiveKillConfirmed'),
                tagFriendly: Stat(match.playerStats, 'objectiveKcFriendlyPickup'),
                // Misc
                gainedGunRank: Stat(match.playerStats, 'objectiveGainedGunRank'),
                equipmentDestroyed: Stat(match.playerStats, 'objectiveDestroyedEquipment'),
            },
            loadouts: match.player.loadout.map(loadout => Loadout(loadout)),
        })
    }
}