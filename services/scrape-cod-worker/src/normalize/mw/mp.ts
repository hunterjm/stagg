import * as API from '@stagg/api'
import * as MDB from '@stagg/mdb'
import { Stat, Loadout } from '..'

export const Performance = (match:API.Schema.CallOfDuty.MW.MP.Match, player:Partial<MDB.Schema.CallOfDuty.Account>):MDB.Schema.CallOfDuty.MW.MP.Performance => {
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
            _id: player._id,
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
export const Killstreaks = (player:API.Schema.CallOfDuty.MW.MP.Match.Player, playerStats:API.Schema.CallOfDuty.MW.MP.Match.PlayerStats):{[key:string]:MDB.Schema.CallOfDuty.MW.MP.Performance.Stats.Killstreak} => {
    const killstreaks = {}
    for(const killstreakId in API.Map.CallOfDuty.MW.Killstreaks) {
        killstreaks[killstreakId] = {
            uses: player.killstreakUsage[killstreakId] || 0,
            kills: playerStats[API.Map.CallOfDuty.MW.KillstreakKillsProp(killstreakId)] || 0,
            takedowns: playerStats[API.Map.CallOfDuty.MW.KillstreakTakedownsProp(killstreakId)] || 0,
        }
    }
    return killstreaks
}
export const Weapons = (match:API.Schema.CallOfDuty.MW.MP.Match):{[key:string]:MDB.Schema.CallOfDuty.MW.MP.Performance.Stats.Weapon} => {
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