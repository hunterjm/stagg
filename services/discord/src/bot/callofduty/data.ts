import { Map } from '@stagg/api'
import * as Mongo from '@stagg/mdb'

export interface PlayerIdentifiers {
    uno?:string
    discord?:string
    username?:string
    platform?:string
}
export const findPlayer = async (pids:PlayerIdentifiers):Promise<Mongo.Schema.CallOfDuty.Account> => {
    const db = await Mongo.client('callofduty')
    if (pids.uno) return db.collection('accounts').findOne({ 'profiles.id': pids.uno })
    if (pids.discord) return db.collection('accounts').findOne({ 'discord.id': pids.discord })
    const { username='', platform='uno' } = pids
    return db.collection('accounts').findOne({ [`profiles.${platform.toLowerCase()}`]: { $regex: username, $options: 'i' } })
}

// currently unused, adding kgp's manually
export const addArtificialPlayer = async (origin:string, authSponsorUnoUsername:string, username:string, platform:string='uno', games:string[]=['mw']):Promise<boolean> => {
    const db = await Mongo.client('callofduty')
    const sponsor = await db.collection('accounts').findOne({ 'profiles.uno': authSponsorUnoUsername })
    if (!sponsor) {
        return false
    }
    const scaffold = { origin, auth: sponsor.auth, games, profiles: { [platform]: username } }
    await db.collection('accounts').insertOne(scaffold)
    return true
}

interface FetchedPlayer {
    query: {
        tag: string
        username: string
        platform: string
    }
    player: Mongo.Schema.CallOfDuty.Account
}
export const hydratePlayerIdentifiers = async (authorId:string, pids:string[]):Promise<FetchedPlayer[]> => {
    const db = {
        cod: await Mongo.client('callofduty'),
        stagg: await Mongo.client('stagg')
    }
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
            const user = await db.stagg.collection('users').findOne({ 'discord.id': discordId })
            if (user?.accounts?.callofduty) {
                const player = await db.cod.collection('accounts').findOne({ _id: user.accounts.callofduty })
                foundPlayers.push({
                    player,
                    query: { discord: discordId, tag: `<@!${discordId}>` },
                })
            }
        }
    }
    // all username + platform combos are gone, now reduce uno usernames and shortcuts if applicable
    const user = await db.stagg.collection('users').findOne({ 'discord.id': authorId })
    if (user?.accounts?.callofduty) {
        const player = await db.cod.collection('accounts').findOne({ _id: user.accounts.callofduty })
        for(const i in pids) {
            if (!pids[i]) continue
            const pid = pids[i].toLowerCase()
            if (pid === 'me') {
                queries.push({ username: player.profiles.uno, platform: 'uno', tag: `me` })
                delete pids[i]
                continue
            }
            if (user.discord?.shortcuts && user.discord?.shortcuts[pid]) {
                const shortcutPlayers = await hydratePlayerIdentifiers(authorId, user.discord.shortcuts[pid].split(' '))
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

//['https://stagg.co/api/chart.png?c={type:'pie',data:{labels:['Solos','Duos','Trios','Quads'],datasets:[{data:[6,4,52,42]}]}}']

// const aggr = await db.collection('mw.wz.performances').aggregate([
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

const groupSumObj = (stat:string) => {
    let groupSum
    switch(stat) {
        case 'loadouts': groupSum = { $sum: { $size: `$loadouts` } }
            break
        case 'downs': groupSum = { $sum: { $sum: `$stats.downs` } }
            break
        default: groupSum = { $sum: `$stats.${stat}` }
    }
    return groupSum
}

export const isolatedStat = async (player:Mongo.Schema.CallOfDuty.Account, stat:string, modeIds:string[]=[], sort?:'time'|'best', limit:number=25) => {
    if (!player) return []
    const db = await Mongo.client('callofduty')
    const modeIdOp = !modeIds || !modeIds.length ? '$nin' : '$in'
    let groupSum
    switch(stat) {
        case 'loadouts': groupSum = { $sum: { $size: `$loadouts` } }
            break
        case 'downs': groupSum = { $sum: { $sum: `$stats.downs` } }
            break
        default: groupSum = { $sum: `$stats.${stat}` }
    }
    return db.collection('mw.wz.performances').aggregate([
        { $match: {
            'player._id': player._id,
            modeId: { [modeIdOp]: modeIds || [] },
            'stats.timePlayed': { $gt: 90 }
        } },
        {
            $group: {
                _id: '$startTime',
                startTime: { $sum: '$startTime' },
                endTime: { $sum: '$endTime' },
                [stat]: groupSumObj(stat),
            }
        },
        { $sort: { _id: -1 } },
        { $limit: limit },
    ]).toArray()
}
export const ratioStat = async (player:Mongo.Schema.CallOfDuty.Account, stat:string, modeIds:string[]=[], sort?:'time'|'best', limit:number=25) => {
    if (!player) return []
    const db = await Mongo.client('callofduty')
    const modeIdOp = !modeIds || !modeIds.length ? '$nin' : '$in'
    const [dividend, divisor] = stat.split('/')
    return db.collection('mw.wz.performances').aggregate([
        { $match: {
            'player._id': player._id,
            modeId: { [modeIdOp]: modeIds || [] },
            'stats.timePlayed': { $gt: 90 }
        } },
        {
            $group: {
                _id: '$startTime',
                startTime: { $sum: '$startTime' },
                endTime: { $sum: '$endTime' },
                divisor: groupSumObj(divisor),
                dividend: groupSumObj(dividend),
            }
        },
        {
            $project : {
                _id : '$_id',
                startTime: '$startTime',
                endTime: '$endTime',
                [stat] : { $cond: [ { $eq: [ '$divisor', 0 ] }, '$dividend', {'$divide':['$dividend', '$divisor']} ] }
            }
        },
        { $sort: { _id: -1 } },
        { $limit: limit },
    ]).toArray()
}

export const statsReport = async (player:Mongo.Schema.CallOfDuty.Account, modeIds:string[]=[], groupByModeId=false) => {
    if (!player) return []
    const db = await Mongo.client('callofduty')
    // if we're fetching 'all' _id should be $modeId
    // if we're fetching anything else we should aggregate them all together
    const modeIdOp = !modeIds || !modeIds.length ? '$nin' : '$in'
    return db.collection('mw.wz.performances').aggregate([
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
            downs: { $sum: { $sum: '$stats.downs' } },
            loadouts: { $sum: { $size: '$loadouts' } },
            gulagWins: {
                $sum: {
                    $switch: { 
                        branches: [ 
                            { 
                                case: { $gt: [ '$stats.gulagKills', 0 ] }, 
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
                                case: { $gt: [ '$stats.gulagKills', 0 ] }, 
                                then: 1
                            },
                            { 
                                case: { $gt: [ '$stats.gulagDeaths', 0 ] }, 
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
                                case: { $eq: [ '$stats.teamPlacement', 1 ] }, 
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
                                case: { $lt: [ '$stats.teamPlacement', 6 ] }, 
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
                                case: { $lt: [ '$stats.teamPlacement', 11 ] }, 
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