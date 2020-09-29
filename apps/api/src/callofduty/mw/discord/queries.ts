import { Schema, Normalize } from '@stagg/callofduty'

export namespace MP {
    export function WeaponStats(playerId:string, modeIds:Schema.API.MW.Match.Mode[]) {
        const modeIdOp = !modeIds || !modeIds.length ? '$nin' : '$in'
        const stats = ['kills', 'deaths', 'headshots', 'shots.hit', 'shots.miss']
        const weaponGroups = {}
        for(const weapon in Normalize.MW.Weapons) {
            for(const stat of stats) {
                weaponGroups[`${stat.split('.').join('_')}__${weapon}`] = {
                    $sum: `$stats.weapons.${weapon}.${stat}`
                }
            }
        }
        return [
            { $match: { _account: playerId, modeId: { [modeIdOp]: modeIds || [] } } },
            { $sort: { startTime: -1 } },
            {
                $group: {
                    _id: null,
                    ...weaponGroups,
                }
            },
        ]
    }
}

export namespace WZ {
    export function Barracks(playerId:string, modeIds:Schema.API.MW.Match.Mode[]) {
        const modeIdOp = !modeIds || !modeIds.length ? '$nin' : '$in'
        const finalCircle = Normalize.MW.WZ.CircleToTime(Normalize.MW.WZ.CircleTimes.length)
        return [
            { $match: { _account: playerId, modeId: { [modeIdOp]: modeIds || [] } } },
            { $sort: { startTime: -1 } },
            {
                $group: {
                    _id: null,
                    games: { $sum: 1 },
                    score: { $sum: '$stats.score' },
                    kills: { $sum: '$stats.kills' },
                    deaths: { $sum: '$stats.deaths' },
                    damageDone: { $sum: '$stats.damageDone' },
                    damageTaken: { $sum: '$stats.damageTaken' },
                    teamWipes: { $sum: '$stats.teamWipes' },
                    teamSurvivalTime: { $sum: '$stats.teamSurvivalTime' },
                    teamPlacement: { $sum: '$stats.teamPlacement' },
                    eliminations: { $sum: '$stats.eliminations' },
                    revives: { $sum: '$stats.revives' },
                    contracts: { $sum: '$stats.contracts' },
                    lootCrates: { $sum: '$stats.lootCrates' },
                    buyStations: { $sum: '$stats.buyStations' },
                    timePlayed: { $sum: '$stats.timePlayed' },
                    distanceTraveled: { $sum: '$stats.distanceTraveled' },
                    percentTimeMoving: { $sum: '$stats.percentTimeMoving' },
                    downs: { $sum: { $sum: '$stats.downs' } },
                    loadouts: { $sum: { $size: '$loadouts' } },
                    mostDeaths: { $max: '$stats.deaths' },
                    bestKills: { $max: '$stats.kills' },
                    bestKillstreak: { $max: '$stats.killstreak' },
                    bestTeamWipes: { $max: '$stats.teamWipes' },
                    finalCircles: {
                        $sum: {
                            $switch: {
                                branches: [
                                    {
                                        case: { $gt: ['$stats.teamSurvivalTime', finalCircle.circleStart * 1000] },
                                        then: 1
                                    }
                                ],
                                default: 0
                            }
                        }
                    },
                    gulagWins: {
                        $sum: {
                            $switch: {
                                branches: [
                                    {
                                        case: { $gt: ['$stats.gulagKills', 0] },
                                        then: 1
                                    }
                                ],
                                default: 0
                            }
                        }
                    },
                    gulagGames: {
                        $sum: {
                            $switch: {
                                branches: [
                                    {
                                        case: { $gt: ['$stats.gulagKills', 0] },
                                        then: 1
                                    },
                                    {
                                        case: { $gt: ['$stats.gulagDeaths', 0] },
                                        then: 1
                                    }
                                ],
                                default: 0
                            }
                        }
                    },
                    wins: {
                        $sum: {
                            $switch: {
                                branches: [
                                    {
                                        case: { $eq: ['$stats.teamPlacement', 1] },
                                        then: 1
                                    }
                                ],
                                default: 0
                            }
                        }
                    },
                    top5: {
                        $sum: {
                            $switch: {
                                branches: [
                                    {
                                        case: { $lt: ['$stats.teamPlacement', 6] },
                                        then: 1
                                    }
                                ],
                                default: 0
                            }
                        }
                    },
                    top10: {
                        $sum: {
                            $switch: {
                                branches: [
                                    {
                                        case: { $lt: ['$stats.teamPlacement', 11] },
                                        then: 1
                                    }
                                ],
                                default: 0
                            }
                        }
                    }
                }
            },
        ]
    }
    export function StatsReport(playerId:string, modeIds:Schema.API.MW.Match.Mode[], groupByModeId:boolean=false) {
        const modeIdOp = !modeIds || !modeIds.length ? '$nin' : '$in'
        return [
            { $match: { _account: playerId, modeId: { [modeIdOp]: modeIds || [] } } },
            { $sort: { startTime: -1 } },
            {
                $group: {
                    _id: groupByModeId ? '$modeId' : null,
                    games: { $sum: 1 },
                    score: { $sum: '$stats.score' },
                    kills: { $sum: '$stats.kills' },
                    deaths: { $sum: '$stats.deaths' },
                    damageDone: { $sum: '$stats.damageDone' },
                    damageTaken: { $sum: '$stats.damageTaken' },
                    teamWipes: { $sum: '$stats.teamWipes' },
                    eliminations: { $sum: '$stats.eliminations' },
                    timePlayed: { $sum: '$stats.timePlayed' },
                    distanceTraveled: { $sum: '$stats.distanceTraveled' },
                    percentTimeMoving: { $sum: '$stats.percentTimeMoving' },
                    downs: { $sum: { $sum: '$stats.downs' } },
                    loadouts: { $sum: { $size: '$loadouts' } },
                    gulagWins: {
                        $sum: {
                            $switch: {
                                branches: [
                                    {
                                        case: { $gt: ['$stats.gulagKills', 0] },
                                        then: 1
                                    }
                                ],
                                default: 0
                            }
                        }
                    },
                    gulagGames: {
                        $sum: {
                            $switch: {
                                branches: [
                                    {
                                        case: { $gt: ['$stats.gulagKills', 0] },
                                        then: 1
                                    },
                                    {
                                        case: { $gt: ['$stats.gulagDeaths', 0] },
                                        then: 1
                                    }
                                ],
                                default: 0
                            }
                        }
                    },
                    wins: {
                        $sum: {
                            $switch: {
                                branches: [
                                    {
                                        case: { $eq: ['$stats.teamPlacement', 1] },
                                        then: 1
                                    }
                                ],
                                default: 0
                            }
                        }
                    },
                    top5: {
                        $sum: {
                            $switch: {
                                branches: [
                                    {
                                        case: { $lt: ['$stats.teamPlacement', 6] },
                                        then: 1
                                    }
                                ],
                                default: 0
                            }
                        }
                    },
                    top10: {
                        $sum: {
                            $switch: {
                                branches: [
                                    {
                                        case: { $lt: ['$stats.teamPlacement', 11] },
                                        then: 1
                                    }
                                ],
                                default: 0
                            }
                        }
                    }
                }
            },
        ]
    }
}

export namespace MP {
    export function StatsReport(playerId:string, modeIds:Schema.API.MW.Match.Mode[], groupByModeId:boolean=false) {
        const modeIdOp = !modeIds || !modeIds.length ? {} : { modeId: { "$in": modeIds } }
        return [
            { $match: { _account: playerId, ...modeIdOp } },
            { $sort: { startTime: -1 } },
            {
                $group: {
                    _id: groupByModeId ? '$modeId' : null,
                    games: { $sum: 1 },
                    wins: {
                        $sum: {
                            $switch: {
                                branches: [
                                    {
                                        case: { $eq: ['$stats.teamPlacement', 1] },
                                        then: 1
                                    }
                                ],
                                default: 0
                            }
                        }
                    },
                    losses: {
                        $sum: {
                            $switch: {
                                branches: [
                                    {
                                        case: { $eq: ['$stats.teamPlacement', 2] },
                                        then: 1
                                    }
                                ],
                                default: 0
                            }
                        }
                    },
                    draws: {
                        $sum: {
                            $switch: {
                                branches: [
                                    {
                                        case: { $eq: ['$stats.teamPlacement', 0] },
                                        then: 1
                                    }
                                ],
                                default: 0
                            }
                        }
                    },
                    score: { $sum: '$stats.score' },
                    kills: { $sum: '$stats.kills' },
                    deaths: { $sum: '$stats.deaths' },
                    assists: { $sum: '$stats.assists' },
                    shotsLanded: { $sum: '$stats.shots.hit' },
                    shotsMissed: { $sum: '$stats.shots.miss' },
                    executions: { $sum: '$stats.executions' },
                    headshots: { $sum: '$stats.headshots' },
                    avgLongestStreak: { $avg: '$stats.longestStreak' },
                    timePlayed: { $sum: '$stats.timePlayed' },
                    // fave weapon?
                    // fave killstreak or killstreak counts
                    // objective medal counts?
                    loadouts: { $sum: { $size: '$loadouts' } },
                    rageQuits: {
                        $sum: {
                            $switch: {
                                branches: [
                                    {
                                        case: { $and: [{ $eq: ['$quit', true] }, { $gt: ['$stats.timePlayed', 60] }] },
                                        then: 1
                                    }
                                ],
                                default: 0
                            }
                        }
                    }
                }
            }
        ]
    }
}
