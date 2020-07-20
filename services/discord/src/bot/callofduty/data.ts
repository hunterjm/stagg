import { Map } from '@stagg/api'
import * as Mongo from '@stagg/mdb'

export interface PlayerIdentifiers {
    uno?:string
    discord?:string
    username?:string
    platform?:string
}
export const findPlayer = async (pids:PlayerIdentifiers):Promise<Mongo.Schema.CallOfDuty.Player> => {
    const db = await Mongo.client('callofduty')
    if (pids.uno) return db.collection('players').findOne({ 'profiles.id': pids.uno })
    if (pids.discord) return db.collection('players').findOne({ 'discord.id': pids.discord })
    const { username='', platform='uno' } = pids
    return db.collection('players').findOne({ [`profiles.${platform.toLowerCase()}`]: { $regex: username, $options: 'i' } })
}

interface FetchedPlayer {
    query: {
        tag: string
        username: string
        platform: string
    }
    player: Mongo.Schema.CallOfDuty.Player
}
export const hydratePlayerIdentifiers = async (authorId:string, pids:string[]):Promise<FetchedPlayer[]> => {
    const db = await Mongo.client('callofduty')
    const queries = []
    for(const i in pids) {
        const pid = pids[i].toLowerCase()
        const index = Number(i)
        if (Object.keys(Map.CallOfDuty.Platforms).includes(pid)) {
            if (!pids[index-1]) {
                // its a platform identifier with no preceding username, dump it
                delete pids[index]
                continue
            }
            queries.push({ username: pids[index-1], platform: pid, tag: `${pids[index-1]}:${pid}` })
            delete pids[index]
            delete pids[index-1]
        }
    }
    const foundPlayers = []
    // reduce discord tags if possible
    for(const i in pids) {
        const pid = pids[i]
        if (pid.match(/<@!([0-9]+)>/)) {
            const discordId = pid.replace(/<@!([0-9]+)>/, '$1')
            const player = await db.collection('players').findOne({ 'discord.id': discordId })
            if (player) {
                foundPlayers.push({
                    player,
                    query: { discord: discordId, tag: `<@!${discordId}>` },
                })
            }
        }
    }
    // all username + platform combos are gone, now reduce uno usernames and shortcuts if applicable
    const player = await db.collection('players').findOne({ 'discord.id': authorId })
    if (player) {
        for(const i in pids) {
            if (!pids[i]) continue
            const pid = pids[i].toLowerCase()
            if (pid === 'me') {
                queries.push({ username: player.profiles.uno, platform: 'uno', tag: `me` })
                delete pids[i]
                continue
            }
            if (player.discord?.shortcuts && player.discord?.shortcuts[pid]) {
                const shortcutPlayers = await hydratePlayerIdentifiers(authorId, player.discord.shortcuts[pid].split(' '))
                if (shortcutPlayers.length) {
                    delete pids[i]
                    foundPlayers.push(...shortcutPlayers)
                }
            }
        }
    }
    for(const pid of pids) {
        if (!pid) continue
        queries.push({ username: pid, platform: 'uno', tag: pid })
    }
    for(const query of queries) {
        const player = await findPlayer({ username: query.username, platform: query.platform })
        foundPlayers.push({ query, player })
    }
    return foundPlayers
}

//["https://stagg.co/api/chart.png?c={type:'pie',data:{labels:['Solos','Duos','Trios','Quads'],datasets:[{data:[6,4,52,42]}]}}"]

// const aggr = await db.collection('performances.wz').aggregate([
//     { $match: { 'player._id': player._id } },
//     { $sort: { startTime: -1 } },
//     { $group: {
//         _id: { finishPos: '$stats.teamPlacement', mode: '$modeId' },
//         games: { $sum: 1 },
//         kills: { $sum: '$stats.kills' },
//         deaths: { $sum: '$stats.deaths' },
//     } },
//     { $limit: 50 },
// ], { cursor: { batchSize: 1 } }).toArray()

export const isolatedStat = async (player:Mongo.Schema.CallOfDuty.Player, stat:string, modeIds:string[]=[], sort?:'time'|'best', limit:number=25) => {
    const db = await Mongo.client()
    const modeIdOp = !modeIds || !modeIds.length ? '$nin' : '$in'
    return db.collection('performances.wz').aggregate([
        { $match: {
            'player._id': player._id,
            modeId: { [modeIdOp]: modeIds || [] },
            'stats.timePlayed': { $gt: 90 }
        } },
        {
            $group: {
                _id: '$startTime',
                [stat]: { $sum: `$stats.${stat}` },
            }
        },
        { $sort: { _id: -1 } },
        { $limit: limit },
    ]).toArray()
}
export const ratioStat = async (player:Mongo.Schema.CallOfDuty.Player, stat:string, modeIds:string[]=[], sort?:'time'|'best', limit:number=25) => {
    const db = await Mongo.client()
    const modeIdOp = !modeIds || !modeIds.length ? '$nin' : '$in'
    const [dividend, divisor] = stat.split('/')
    return db.collection('performances.wz').aggregate([
        { $match: {
            'player._id': player._id,
            modeId: { [modeIdOp]: modeIds || [] },
            'stats.timePlayed': { $gt: 90 }
        } },
        {
            $group: {
                _id: '$startTime',
                divisor: { $sum: `$stats.${divisor}` },
                dividend: { $sum: `$stats.${dividend}` },
            }
        },
        {
            $project : {
                _id : "$_id",
                [stat] : { $cond: [ { $eq: [ "$divisor", 0 ] }, "$dividend", {"$divide":["$dividend", "$divisor"]} ] }
            }
        },
        { $sort: { _id: -1 } },
        { $limit: limit },
    ]).toArray()
}

export const statsReport = async (player:Mongo.Schema.CallOfDuty.Player, modeIds:string[]=[], groupByModeId=false) => {
    const db = await Mongo.client()
    // if we're fetching "all" _id should be $modeId
    // if we're fetching anything else we should aggregate them all together
    const modeIdOp = !modeIds || !modeIds.length ? '$nin' : '$in'
    return db.collection('performances.wz').aggregate([
        { $match: { 'player._id': player._id, modeId: { [modeIdOp]: modeIds || [] } } },
        { $sort: { startTime: -1 } },
        { $group: {
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
            // downs: { $sum: { $reduce: { input: '$stats.downs', initialValue: 0, in: { $add : ["$$value", "$$this"] } } } },
            gulagWins: {
                $sum: {
                    $switch: { 
                        branches: [ 
                            { 
                                case: { $gt: [ "$stats.gulagKills", 0 ] }, 
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
                                case: { $gt: [ "$stats.gulagKills", 0 ] }, 
                                then: 1
                            },
                            { 
                                case: { $gt: [ "$stats.gulagDeaths", 0 ] }, 
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
                                case: { $eq: [ "$stats.teamPlacement", 1 ] }, 
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
                                case: { $lt: [ "$stats.teamPlacement", 6 ] }, 
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
                                case: { $lt: [ "$stats.teamPlacement", 11 ] }, 
                                then: 1
                            }
                        ], 
                        default: 0
                    }
                }
            }
        } },
    ]).toArray()
}