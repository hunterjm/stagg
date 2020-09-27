import { Schema, Normalize } from '../..'
import { Stat, Loadout } from './match'

export const Details = (match: Schema.API.MW.Routes.MatchDetails):Schema.DB.MW.MP.Match.Details => {
    const [first] = match.allPlayers
    return {
        matchId: first.matchID,
        modeId: first.mode,
        mapId: first.map,
        endTime: first.utcEndSeconds,
        startTime: first.utcStartSeconds,
        players: Players(match)
    }
}

export const Players = (match: Schema.API.MW.Routes.MatchDetails):Schema.DB.MW.MP.Match.Details.Player[] => match.allPlayers.map((p:any) => {
    // Count downs
    let downs = []
    const downKeys = Object.keys(p.playerStats).filter(key => key.includes('objectiveBrDownEnemyCircle'))
    for (const key of downKeys) {
        const circleIndex = Number(key.replace('objectiveBrDownEnemyCircle', ''))
        downs[circleIndex] = Stat(p.playerStats, key)
    }
    return {
        id: p.player.uno,
        team: p.player.team,
        username: p.player.username,
        clantag: p.player.clantag,
        stats: {
            rank: Stat(p.playerStats, 'rank'),
            score: Stat(p.playerStats, 'score'),
            kills: Stat(p.playerStats, 'kills'),
            deaths: Stat(p.playerStats, 'deaths'),
            assists: Stat(p.playerStats, 'assists'),
            executions: Stat(p.playerStats, 'executions'),
            headshots: Stat(p.playerStats, 'headshots'),
            longestStreak: Stat(p.playerStats, 'longestStreak'),
            timePlayed: Stat(p.playerStats, 'timePlayed'),
            teamPlacement: p.result === 'win' ? 1 : p.result === 'loss' ? 2 : 0,
            avgSpeed: Stat(p.playerStats, 'averageSpeedDuringMatch'),
            shots: {
                hit: Stat(p.playerStats, 'shotsLanded'),
                miss: Stat(p.playerStats, 'shotsMissed'),
            },
            weapons: Weapons(p),
            killstreaks: Killstreaks(p.player, p.playerStats),
            objectives: {
                // Flags, etc
                captureKill: Stat(p.playerStats, 'objectiveCaptureKill'),
                defenseKill: Stat(p.playerStats, 'objectiveObjProgDefend'),
                defendScore: Stat(p.playerStats, 'objectiveMedalModeXDefendScore'),
                assaultScore: Stat(p.playerStats, 'objectiveMedalModeXAssaultScore'),
                captureScore: Stat(p.playerStats, 'objectiveMedalModeDomSecureScore'), // dom cap
                captureScoreB: Stat(p.playerStats, 'objectiveMedalModeDomSecureBScore'), // dom cap B flag
                captureAssistScore: Stat(p.playerStats, 'objectiveMedalModeDomSecureAssistScore'), // dom cap assist
                captureNeutralScore: Stat(p.playerStats, 'objectiveMedalModeDomSecureNeutralScore'), // dom cap B flag
                // Kill Confirmed
                tagOwn: Stat(p.playerStats, 'objectiveMedalModeKcOwnTagsScore'),
                tagDeny: Stat(p.playerStats, 'objectiveKillDenied'),
                tagConfirm: Stat(p.playerStats, 'objectiveKillConfirmed'),
                tagFriendly: Stat(p.playerStats, 'objectiveKcFriendlyPickup'),
                // Misc
                gainedGunRank: Stat(p.playerStats, 'objectiveGainedGunRank'),
                equipmentDestroyed: Stat(p.playerStats, 'objectiveDestroyedEquipment'),
            },
            xp: {
                score: Stat(p.playerStats, 'scoreXp'),
                match: Stat(p.playerStats, 'matchXp'),
                medal: Stat(p.playerStats, 'medalXp'),
                misc: Stat(p.playerStats, 'miscXp'),
                total: Stat(p.playerStats, 'totalXp'),
            },
        },
        loadouts: p.player.loadout.map(loadout => Loadout(loadout)),
    } as any
})

export const Record = (match:Schema.API.MW.MP.Match):Schema.DB.MW.MP.Match.Record => {
    return {
        mapId: match.map,
        modeId: match.mode,
        matchId: match.matchID,
        endTime: match.utcEndSeconds,
        startTime: match.utcStartSeconds,
        quit: !match.isPresentAtEnd,
        playlist: match.playlistName,
        gameBattle: match.gameBattle,
        arena: match.arena,
        privateMatch: match.privateMatch,
        player: {
            id: match.player.uno,
            team: match.player.team,
            username: match.player.username,
            clantag: match.player.clantag,
        },
        score: {
            allies: match.team1Score,
            axis: match.team2Score,
        },
        stats: {
            rank: Stat(match.playerStats, 'rank'),
            score: Stat(match.playerStats, 'score'),
            kills: Stat(match.playerStats, 'kills'),
            deaths: Stat(match.playerStats, 'deaths'),
            assists: Stat(match.playerStats, 'assists'),
            executions: Stat(match.playerStats, 'executions'),
            headshots: Stat(match.playerStats, 'headshots'),
            longestStreak: Stat(match.playerStats, 'longestStreak'),
            timePlayed: Stat(match.playerStats, 'timePlayed'),
            teamPlacement: match.result === 'win' ? 1 : match.result === 'loss' ? 2 : 0,
            avgSpeed: Stat(match.playerStats, 'averageSpeedDuringMatch'),
            shots: {
                hit: Stat(match.playerStats, 'shotsLanded'),
                miss: Stat(match.playerStats, 'shotsMissed'),
            },
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
            xp: {
                score: Stat(match.playerStats, 'scoreXp'),
                match: Stat(match.playerStats, 'matchXp'),
                medal: Stat(match.playerStats, 'medalXp'),
                misc: Stat(match.playerStats, 'miscXp'),
                total: Stat(match.playerStats, 'totalXp'),
            },
        },
        loadouts: match.player.loadout.map(loadout => Loadout(loadout)),
    }
}
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
