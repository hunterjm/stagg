import { Schema, Assets } from 'callofduty'

export const Stat = (stats: any, stat: string) => stats && !isNaN(Number(stats[stat])) ? Number(stats[stat]) : 0
export const Loadout = (loadout: Schema.MW.Loadout) => ({
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
export const Killstreaks = (player, playerStats:Schema.MW.Match.Generic.PlayerStats) => {
    const killstreaks = {}
    for(const killstreakId in Assets.MW.Killstreaks) {
        const { props } = Assets.MW.Killstreak(killstreakId as Schema.Killstreak)
        killstreaks[killstreakId] = {
            uses: player.killstreakUsage[killstreakId] || 0,
            kills: playerStats[props.kills] || 0,
            takedowns: playerStats[props.takedowns] || 0,
        }
    }
    return killstreaks
}
export const Weapons = (match:Schema.MW.Match.MP) => {
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

export const MwWzDetails = (match:Schema.MW.Match.WZ) => ({
    matchId: match.matchID,
    modeId: match.mode,
    mapId: match.map,
    endTime: match.utcEndSeconds,
    startTime: match.utcStartSeconds,
})
export const MwWzRecord = (match:Schema.MW.Match.WZ) => {
    // Count downs
    let downs = []
    const downKeys = Object.keys(match.playerStats).filter(key => key.includes('objectiveBrDownEnemyCircle'))
    for (const key of downKeys) {
        const circleIndex = Number(key.replace('objectiveBrDownEnemyCircle', ''))
        downs[circleIndex] = Stat(match.playerStats, key)
    }
    return {
        matchId: match.matchID,
        modeId: match.mode,
        mapId: match.map,
        endTime: match.utcEndSeconds,
        startTime: match.utcStartSeconds,
        teamId: match.player.team,
        username: match.player.username,
        unoId: match.player.uno,
        clantag: match.player.clantag,
        score: Stat(match.playerStats, 'score'),
        kills: Stat(match.playerStats, 'kills'),
        deaths: Stat(match.playerStats, 'deaths'),
        downs,
        gulagKills: Stat(match.playerStats, 'gulagKills'),
        gulagDeaths: Stat(match.playerStats, 'gulagDeaths'),
        eliminations: Stat(match.playerStats, 'objectiveLastStandKill'),
        damageDone: Stat(match.playerStats, 'damageDone'),
        damageTaken: Stat(match.playerStats, 'damageTaken'),
        teamWipes: Stat(match.playerStats, 'objectiveTeamWiped'),
        revives: Stat(match.playerStats, 'objectiveReviver'),
        contracts: Stat(match.playerStats, 'objectiveBrMissionPickupTablet'),
        lootCrates: Stat(match.playerStats, 'objectiveBrCacheOpen'),
        buyStations: Stat(match.playerStats, 'objectiveBrKioskBuy'),
        assists: Stat(match.playerStats, 'assists'),
        executions: Stat(match.playerStats, 'executions'),
        headshots: Stat(match.playerStats, 'headshots'),
        wallBangs: Stat(match.playerStats, 'wallBangs'),
        nearMisses: Stat(match.playerStats, 'nearmisses'),
        clusterKills: Stat(match.playerStats, 'objectiveMedalScoreSsKillTomaStrike'),
        airstrikeKills: Stat(match.playerStats, 'objectiveMedalScoreKillSsRadarDrone'),
        longestStreak: Stat(match.playerStats, 'longestStreak'),
        trophyDefense: Stat(match.playerStats, 'objectiveTrophyDefense'),
        munitionShares: Stat(match.playerStats, 'objectiveMunitionsBoxTeammateUsed'),
        missileRedirects: Stat(match.playerStats, 'objectiveManualFlareMissileRedirect'),
        equipmentDestroyed: Stat(match.playerStats, 'objectiveDestroyedEquipment'),
        percentTimeMoving: Stat(match.playerStats, 'percentTimeMoving'),
        distanceTraveled: Stat(match.playerStats, 'distanceTraveled'),
        teamSurvivalTime: Stat(match.playerStats, 'teamSurvivalTime'),
        teamPlacement: Stat(match.playerStats, 'teamPlacement'),
        timePlayed: Stat(match.playerStats, 'timePlayed'),
        scoreXp: Stat(match.playerStats, 'scoreXp'),
        matchXp: Stat(match.playerStats, 'matchXp'),
        bonusXp: Stat(match.playerStats, 'bonusXp'),
        medalXp: Stat(match.playerStats, 'medalXp'),
        miscXp: Stat(match.playerStats, 'miscXp'),
        challengeXp: Stat(match.playerStats, 'challengeXp'),
        totalXp: Stat(match.playerStats, 'totalXp'),
        loadouts: match.player.loadout.map(loadout => Loadout(loadout)),
    }
}

export const MwMpDetails = (match:Schema.MW.Match.MP) => ({
    matchId: match.matchID,
    modeId: match.mode,
    mapId: match.map,
    endTime: match.utcEndSeconds,
    startTime: match.utcStartSeconds,
})
export const MwMpRecord = (match:Schema.MW.Match.MP) => ({
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
