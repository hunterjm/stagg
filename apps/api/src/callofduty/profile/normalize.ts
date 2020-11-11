// import { Schema } from '../..'

// export namespace Mode {
//     export const MP = (m:Schema.MW.Profile.Mode.MP) => (!m ? null : {
//         timePlayed: m.timePlayed,
//         score: m.score,
//         kills: m.kills,
//         deaths: m.deaths,
//         stabs: m.stabs,
//         setBacks: m.setBacks,
//     })
//     export const WZ = (m:Schema.MW.Profile.Mode.WZ) => (!m ? null : {
//         gamesPlayed: m.gamesPlayed,
//         timePlayed: m.timePlayed,
//         wins: m.wins,
//         score: m.score,
//         kills: m.kills,
//         deaths: m.deaths,
//         downs: m.downs,
//         revives: m.revives,
//         contracts: m.contracts,
//         cash: m.cash,
//     })
// }
// export const Weapon = (w:Schema.MW.Profile.Properties.Weapon) => (!w ? null : {
//     kills: w.kills,
//     deaths: w.deaths,
//     headshots: w.headShots,
//     shots: {
//         hit: w.hits,
//         miss: w.shots - w.hits,
//     }
// })
// export const Equipment = (e:Schema.MW.Profile.Properties.Weapon) => (!e ? null : {
//     kills: e.kills,
//     deaths: e.deaths,
//     headshots: e.headShots,
//     shots: {
//         hit: e.hits,
//         miss: e.shots - e.hits,
//     }
// })

// export namespace Killstreak {
//     export const Lethal = (k:Schema.MW.Profile.ScorestreakData.Scorestreak) => (!k ? null : {
//         uses: k.uses,
//         kills: k.extraStat1,
//         awarded: k.awardedCount,
//     })
//     export const Support = (k:Schema.MW.Profile.ScorestreakData.Scorestreak) => (!k ? null : {
//         uses: k.uses,
//         assists: k.extraStat1,
//         awarded: k.awardedCount,
//     })
// }

// export const Profile = (p:Schema.MW.Profile):Schema.MW.Profile => {
//     const weapons = {}
//     const lethals = {}
//     const tacticals = {}
//     const weaponGroups = [
//         'weapon_other',
//         'weapon_melee',
//         'weapon_pistol',
//         'weapon_smg',
//         'weapon_shotgun',
//         'weapon_assault_rifle',
//         'weapon_lmg',
//         'weapon_marksman',
//         'weapon_sniper',
//         'weapon_launcher',
//     ]
//     for(const weaponGroup of weaponGroups) {
//         for(const weaponId in p.lifetime.itemData[weaponGroup]) {
//             weapons[weaponId] = Weapon(p.lifetime.itemData[weaponGroup][weaponId].properties)
//         }
//     }
//     for(const lethalId in p.lifetime.itemData.lethals) {
//         lethals[lethalId] = Equipment(p.lifetime.itemData.lethals[lethalId].properties)
//     }
//     for(const tacticalId in p.lifetime.itemData.tacticals) {
//         tacticals[tacticalId] = Equipment(p.lifetime.itemData.tacticals[tacticalId].properties)
//     }
//     const killstreaks:any = {
//         lethal: {},
//         support: {},
//     }
//     for(const killstreakId in p.lifetime.scorestreakData.lethalScorestreakData) {
//         killstreaks.lethal[killstreakId] = Killstreak.Lethal(p.lifetime.scorestreakData.lethalScorestreakData[killstreakId].properties)
//     }
//     for(const killstreakId in p.lifetime.scorestreakData.supportScorestreakData) {
//         killstreaks.support[killstreakId] = Killstreak.Support(p.lifetime.scorestreakData.supportScorestreakData[killstreakId].properties)
//     }
//     return {
//         total: {
//             kills: p.lifetime.all.properties.kills,
//             deaths: p.lifetime.all.properties.deaths,
//             suicides: p.lifetime.all.properties.suicides,
//             headshots: p.lifetime.all.properties.headshots,
//             assists: p.lifetime.all.properties.assists,
//             games: p.lifetime.all.properties.gamesPlayed,
//             wins: p.lifetime.all.properties.wins,
//             ties: p.lifetime.all.properties.ties,
//             losses: p.lifetime.all.properties.losses,
//             score: p.lifetime.all.properties.score,
//             timePlayed: p.lifetime.all.properties.timePlayedTotal,
//             shots: {
//                 hit: p.lifetime.all.properties.hits,
//                 miss: p.lifetime.all.properties.misses,
//             },
//         },
//         best: {
//             kdr: p.lifetime.all.properties.bestKD,
//             spm: p.lifetime.all.properties.bestSPM,
//             score: p.lifetime.all.properties.bestScore,
//             kills: p.lifetime.all.properties.bestKills,
//             deaths: p.lifetime.all.properties.bestDeaths,
//             assists: p.lifetime.all.properties.bestAssists,
//             stabs: p.lifetime.all.properties.bestStabs,
//             damage: p.lifetime.all.properties.bestDamage,
//             winstreak: p.lifetime.all.properties.recordLongestWinStreak,
//             killstreak: p.lifetime.all.properties.bestKillStreak,
//             killchains: p.lifetime.all.properties.bestKillChains,
//             infectedKills: p.lifetime.all.properties.bestKillsAsInfected,
//             survivorKills: p.lifetime.all.properties.bestKillsAsSurvivor,
//             confirmed: p.lifetime.all.properties.bestConfirmed,
//             denied: p.lifetime.all.properties.bestDenied,
//             captures: p.lifetime.all.properties.bestCaptures,
//             defends: p.lifetime.all.properties.bestDefends,
//             plants: p.lifetime.all.properties.bestPlants,
//             defuses: p.lifetime.all.properties.bestDefuses,
//             destructions: p.lifetime.all.properties.bestDestructions,
//             setbacks: p.lifetime.all.properties.bestSetbacks,
//             rescues: p.lifetime.all.properties.bestRescues,
//             returns: p.lifetime.all.properties.bestReturns,
//             touchdowns: p.lifetime.all.properties.bestTouchdowns,
//             fieldGoals: p.lifetime.all.properties.bestFieldgoals,
//             xp: {
//                 total: p.lifetime.all.properties.recordXpInAMatch,
//                 match: p.lifetime.all.properties.bestMatchXp,
//                 score: p.lifetime.all.properties.bestScoreXp,
//                 medal: p.lifetime.all.properties.bestMedalXp,
//                 bonus: p.lifetime.all.properties.bestMatchBonusXp,
//             },
//         },
//         modes: {
//             br: Mode.WZ(p.lifetime.mode.br.properties),
//             br_dmz: Mode.WZ(p.lifetime.mode.br_dmz.properties),
//             br_all: Mode.WZ(p.lifetime.mode.br_all.properties),
//             gun: Mode.MP(p.lifetime.mode.gun.properties),
//             dom: Mode.MP(p.lifetime.mode.dom.properties),
//             war: Mode.MP(p.lifetime.mode.war.properties),
//             hq: Mode.MP(p.lifetime.mode.hq.properties),
//             koth: Mode.MP(p.lifetime.mode.koth.properties),
//             conf: Mode.MP(p.lifetime.mode.conf.properties),
//             arena: Mode.MP(p.lifetime.mode.arena.properties),
//             sd: Mode.MP(p.lifetime.mode.sd.properties),
//             cyber: Mode.MP(p.lifetime.mode.cyber.properties),
//             grnd: Mode.MP(p.lifetime.mode.grnd.properties),
//             arm: Mode.MP(p.lifetime.mode.arm.properties),
//             infect: Mode.MP(p.lifetime.mode.infect.properties),
//             hc_sd: Mode.MP(p.lifetime.mode.hc_sd.properties),
//             hc_hq: Mode.MP(p.lifetime.mode.hc_hq.properties),
//             hc_war: Mode.MP(p.lifetime.mode.hc_war.properties),
//             hc_dom: Mode.MP(p.lifetime.mode.hc_dom.properties),
//             hc_conf: Mode.MP(p.lifetime.mode.hc_conf.properties),
//             hc_cyber: Mode.MP(p.lifetime.mode.hc_cyber.properties),
//         },
//         weapons,
//         equipment: {
//             lethal: lethals,
//             tactical: tacticals,
//         },
//         killstreaks,
//         // accolades: {},
//     }
// }





















// export interface Loadout {
//     primary: Loadout.Weapon
//     secondary: Loadout.Weapon
//     lethal: string
//     tactical: string
//     perks: string[]
//     killstreaks: string[]
// }
// export namespace Loadout {
//     export interface Weapon {
//         weapon: Schema.API.MW.Weapon.Name
//         variant: number
//         attachments: string[]
//     }
// }

// export interface Profile {
//     level, levelXpRemainder, levelXpGained, totalXp
//     total: {
//         kills: number
//         deaths: number
//         suicides: number
//         headshots: number
//         assists: number
//         games: number
//         wins: number
//         ties: number
//         losses: number
//         score: number
//         timePlayed: number
//         shots: {
//             hit: number
//             miss: number
//         }
//     }
//     best: {
//         kdr: number
//         spm: number
//         score: number
//         kills: number
//         deaths: number
//         assists: number
//         stabs: number
//         damage: number
//         winstreak: number
//         killstreak: number
//         killchains: number
//         infectedKills: number
//         survivorKills: number
//         confirmed: number
//         denied: number
//         captures: number
//         defends: number
//         plants: number
//         defuses: number
//         destructions: number
//         setbacks: number
//         rescues: number
//         returns: number
//         touchdowns: number
//         fieldGoals: number
//         xp: {
//             total: number
//             match: number
//             score: number
//             medal: number
//             bonus: number
//         }
//     }
//     modes: {
//         [key:string]: {
//             timePlayed: number
//             score: number
//             kills: number
//             deaths: number
            
//             stabs?: number
//             setBacks?: number

//             gamesPlayed?: number
//             wins?: number
//             downs?: number
//             revives?: number
//             contracts?: number
//             cash?: number
//         }
//     }
//     weapons: {
//         [key:string]: {
//             kills: number
//             deaths: number
//             headshots: number
//             shots: {
//                 hit: number
//                 miss: number
//             }
//         }
//     }
//     equipment: {
//         lethal: {
//             [key:string]: {
//                 kills: number
//                 deaths: number
//                 headshots: number
//                 shots: {
//                     hit: number
//                     miss: number
//                 }
//             }
//         }
//         tactical: {
//             [key:string]: {
//                 kills: number
//                 deaths: number
//                 headshots: number
//                 shots: {
//                     hit: number
//                     miss: number
//                 }
//             }
//         }
//     },
//     killstreaks: {
//         [key:string]: {
//             uses: number
//             awarded: number

//             kills?: number
//             assists?: number
//         }
//     }
// }