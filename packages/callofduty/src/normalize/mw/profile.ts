import { Schema } from '../..'

export namespace Mode {
    export const MP = (m:Schema.API.MW.Routes.Profile.Mode.MP) => ({
        timePlayed: m.timePlayed,
        score: m.score,
        kills: m.kills,
        deaths: m.deaths,
        stabs: m.stabs,
        setBacks: m.setBacks,
    })
    export const WZ = (m:Schema.API.MW.Routes.Profile.Mode.WZ) => ({
        gamesPlayed: m.gamesPlayed,
        timePlayed: m.timePlayed,
        wins: m.wins,
        score: m.score,
        kills: m.kills,
        deaths: m.deaths,
        downs: m.downs,
        revives: m.revives,
        contracts: m.contracts,
        cash: m.cash,
    })
}
export const Weapon = (w:Schema.API.MW.Routes.Profile.Properties.Weapon) => ({
    kills: w.kills,
    deaths: w.deaths,
    headshots: w.headShots,
    shots: {
        hit: w.hits,
        miss: w.shots - w.hits,
    }
})
export const Equipment = (w:Schema.API.MW.Routes.Profile.Properties.Weapon) => ({
    kills: w.kills,
    deaths: w.deaths,
    headshots: w.headShots,
    shots: {
        hit: w.hits,
        miss: w.shots - w.hits,
    }
})

export namespace Killstreak {
    export const Lethal = (k:Schema.API.MW.Routes.Profile.ScorestreakData.Scorestreak) => ({
        uses: k.uses,
        kills: k.extraStat1,
        awarded: k.awardedCount,
    })
    export const Support = (k:Schema.API.MW.Routes.Profile.ScorestreakData.Scorestreak) => ({
        uses: k.uses,
        assists: k.extraStat1,
        awarded: k.awardedCount,
    })
}

export const Profile = (p:Schema.API.MW.Routes.Profile):Schema.DB.MW.Profile => {
    const weapons = {}
    const lethals = {}
    const tacticals = {}
    const weaponGroups = [
        'weapon_other',
        'weapon_melee',
        'weapon_pistol',
        'weapon_smg',
        'weapon_shotgun',
        'weapon_assault_rifle',
        'weapon_lmg',
        'weapon_marksman',
        'weapon_sniper',
        'weapon_launcher',
    ]
    for(const weaponGroup of weaponGroups) {
        for(const weaponId in p.lifetime.itemData[weaponGroup]) {
            weapons[weaponId] = Weapon(p.lifetime.itemData[weaponGroup][weaponId])
        }
    }
    for(const lethalId in p.lifetime.itemData.lethals) {
        lethals[lethalId] = Equipment(p.lifetime.itemData.lethals[lethalId])
    }
    for(const tacticalId in p.lifetime.itemData.tacticals) {
        tacticals[tacticalId] = Equipment(p.lifetime.itemData.lethals[tacticalId])
    }
    const killstreaks = {
        lethal: {},
        support: {},
    }
    for(const killstreakId in p.lifetime.scorestreakData.lethalScorestreakData) {
        killstreaks.lethal[killstreakId] = Killstreak.Lethal(p.lifetime.scorestreakData.lethalScorestreakData[killstreakId].properties)
    }
    for(const killstreakId in p.lifetime.scorestreakData.supportScorestreakData) {
        killstreaks.support[killstreakId] = Killstreak.Support(p.lifetime.scorestreakData.supportScorestreakData[killstreakId].properties)
    }
    return {
        total: {
            kills: p.lifetime.all.kills,
            deaths: p.lifetime.all.deaths,
            suicides: p.lifetime.all.suicides,
            headshots: p.lifetime.all.headshots,
            assists: p.lifetime.all.assists,
            games: p.lifetime.all.gamesPlayed,
            wins: p.lifetime.all.wins,
            ties: p.lifetime.all.ties,
            losses: p.lifetime.all.losses,
            score: p.lifetime.all.score,
            timePlayed: p.lifetime.all.timePlayedTotal,
            shots: {
                hit: p.lifetime.all.hits,
                miss: p.lifetime.all.misses,
            },
        },
        best: {
            kdr: p.lifetime.all.bestKD,
            spm: p.lifetime.all.bestSPM,
            score: p.lifetime.all.bestScore,
            kills: p.lifetime.all.bestKills,
            deaths: p.lifetime.all.bestDeaths,
            assists: p.lifetime.all.bestAssists,
            stabs: p.lifetime.all.bestStabs,
            damage: p.lifetime.all.bestDamage,
            winstreak: p.lifetime.all.recordLongestWinStreak,
            killstreak: p.lifetime.all.bestKillStreak,
            killchains: p.lifetime.all.bestKillChains,
            infectedKills: p.lifetime.all.bestKillsAsInfected,
            survivorKills: p.lifetime.all.bestKillsAsSurvivor,
            confirmed: p.lifetime.all.bestConfirmed,
            denied: p.lifetime.all.bestDenied,
            captures: p.lifetime.all.bestCaptures,
            defends: p.lifetime.all.bestDefends,
            plants: p.lifetime.all.bestPlants,
            defuses: p.lifetime.all.bestDefuses,
            destructions: p.lifetime.all.bestDestructions,
            setbacks: p.lifetime.all.bestSetbacks,
            rescues: p.lifetime.all.bestRescues,
            returns: p.lifetime.all.bestReturns,
            touchdowns: p.lifetime.all.bestTouchdowns,
            fieldGoals: p.lifetime.all.bestFieldgoals,
            xp: {
                total: p.lifetime.all.recordXpInAMatch,
                match: p.lifetime.all.bestMatchXp,
                score: p.lifetime.all.bestScoreXp,
                medal: p.lifetime.all.bestMedalXp,
                bonus: p.lifetime.all.bestMatchBonusXp,
            },
        },
        modes: {
            br: Mode.WZ(p.lifetime.mode.br.properties),
            br_dmz: Mode.WZ(p.lifetime.mode.br_dmz.properties),
            br_all: Mode.WZ(p.lifetime.mode.br_all.properties),
            gun: Mode.MP(p.lifetime.mode.gun.properties),
            dom: Mode.MP(p.lifetime.mode.dom.properties),
            war: Mode.MP(p.lifetime.mode.war.properties),
            hq: Mode.MP(p.lifetime.mode.hq.properties),
            koth: Mode.MP(p.lifetime.mode.koth.properties),
            conf: Mode.MP(p.lifetime.mode.conf.properties),
            arena: Mode.MP(p.lifetime.mode.arena.properties),
            sd: Mode.MP(p.lifetime.mode.sd.properties),
            cyber: Mode.MP(p.lifetime.mode.cyber.properties),
            grnd: Mode.MP(p.lifetime.mode.grnd.properties),
            arm: Mode.MP(p.lifetime.mode.arm.properties),
            infect: Mode.MP(p.lifetime.mode.infect.properties),
            hc_sd: Mode.MP(p.lifetime.mode.hc_sd.properties),
            hc_hq: Mode.MP(p.lifetime.mode.hc_hq.properties),
            hc_war: Mode.MP(p.lifetime.mode.hc_war.properties),
            hc_dom: Mode.MP(p.lifetime.mode.hc_dom.properties),
            hc_conf: Mode.MP(p.lifetime.mode.hc_conf.properties),
            hc_cyber: Mode.MP(p.lifetime.mode.hc_cyber.properties),
        },
        weapons,
        equipment: {
            lethal: lethals,
            tactical: tacticals,
        },
        killstreaks,
        // accolades: {},
    }
}
