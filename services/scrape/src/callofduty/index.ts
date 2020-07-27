import { delay } from '@stagg/util'
import * as mdb from '@stagg/mdb'
import * as API from '@stagg/api'
import * as Scraper from './scraper'
import cfg from '../config'

mdb.config(cfg.mongo)

export const timestamp = () => Math.round(new Date().getTime()/1000)

export const updateExistingPlayers = async () => {
    const db = await mdb.client()
    while(true) {
        const [ player ] = await db.collection('accounts')
            .find({ 'scrape.updated': { $exists: true }, 'scrape.initialized': { $exists: true } })
            .sort({ 'scrape.updated': 1 }).toArray()
        if (!player) continue
        await update(player)
    }
}
export const initializeArtificialPlayers = async () => {
    const db = await mdb.client()
    while(true) {
        const player = await db.collection('accounts').findOne({
            origin: { $nin: ['self'] },
            games: { $exists: true },
            profiles: { $exists: true },
            'scrape.initialized': { $exists: false },
        })
        if (!player) continue
        try {
            await initialize(player)
            await db.collection('accounts').updateOne({ _id: player._id }, { $set: { 'scrape.initialized': timestamp() } })
            await delay(cfg.scrape.wait)
        } catch(e) {
            // This can fail if they have no titleIdentities returned, so signal in the db to skip for now
            await db.collection('accounts').updateOne({ _id: player._id }, { $set: { initFailure: true } })
        }
    }
}
export const initializeNewPlayers = async () => {
    const db = await mdb.client()
    while(true) {
        const player = await db.collection('accounts').findOne({ origin: 'self', 'scrape.initialized': { $exists: false }, initFailure: { $exists: false } })
        if (!player) continue
        try {
            const { games, profiles } = await updateIdentity(player) // required on initialize
            player.games = games
            player.profiles = profiles
            await initialize(player)
            await db.collection('accounts').updateOne({ _id: player._id }, { $set: { 'scrape.initialized': timestamp() } })
            await delay(cfg.scrape.wait)
        } catch(e) {
            // This can fail if they have no titleIdentities returned, so signal in the db to skip for now
            await db.collection('accounts').updateOne({ _id: player._id }, { $set: { initFailure: true } })
        }
    }
}
export const recheckExistingPlayers = async () => {
    const db = await mdb.client()
    while(true) {
        const neverRechecked = await db.collection('accounts').findOne({ 'scrape.initialized': { $exists: true }, 'scrape.rechecked': { $exists: false } })
        const [ player ] = neverRechecked ? [neverRechecked]
            : await db.collection('accounts')
                .find({ 'scrape.initialized': { $exists: true }, 'scrape.rechecked': { $exists: true, $lt: timestamp() - cfg.scrape.cooldown } })
                .sort({ 'scrape.rechecked': 1 }).toArray()
        if (!player) continue
        await db.collection('accounts').updateOne({ _id: player._id }, { $set: { 'scrape.rechecked': timestamp() } })
        try {
            if (player.origin === 'self') {
                const { games, profiles } = await updateIdentity(player) // optional on recheck (checks for new games)
                player.games = games
                player.profiles = profiles
            }
            await recheck(player)
            await delay(cfg.scrape.wait)
        } catch(e) {
            console.log('[!] Recheck failed for', player.email, e)
        }
    }
}

const playerLabel = (player:mdb.Schema.CallOfDuty.Account):string => player.email || player.profiles.uno || 'artificial player'

const modes:API.Schema.CallOfDuty.Mode[] = ['mp', 'wz']
export const update = async (player:mdb.Schema.CallOfDuty.Account) => {
    console.log(`[+] Updating ${playerLabel(player)}`)
    for(const game of player.games) {
        for(const mode of modes) {
            const instance = new Scraper.Runners.Matches(player, { game, mode, start: 0, redundancy: false })
            await instance.ETL(cfg.mongo)
        }
    }
}
export const recheck = async (player:mdb.Schema.CallOfDuty.Account) => {
    console.log(`[+] Rechecking ${playerLabel(player)}`)
    for(const game of player.games) {
        for(const mode of modes) {
            const instance = new Scraper.Runners.Matches(player, { game, mode, start: 0, redundancy: true })
            await instance.ETL(cfg.mongo)
        }
    }
}
export const initialize = async (player:mdb.Schema.CallOfDuty.Account, ) => {
    console.log(`[+] Initializing ${playerLabel(player)}`)
    for(const game of player.games) {
        for(const mode of modes) {
            const start = player.scrape && player.scrape[game] && player.scrape[game][mode] && player.scrape[game][mode].timestamp
                ? player.scrape[game][mode].timestamp : 0
            const instance = new Scraper.Runners.Matches(player, { game, mode, start, redundancy: false })
            await instance.ETL(cfg.mongo)
        }
    }
}

export const updateIdentity = async (player:mdb.Schema.CallOfDuty.Account, ) => {
    const db = await mdb.client()
    const games:string[] = []
    const profiles:{[key:string]:string} = {}
    const CallOfDutyAPI = new API.CallOfDuty(player.auth)
    const identity = await CallOfDutyAPI.Identity()
    for(const identifier of identity.titleIdentities) {
        games.push(identifier.title)
        profiles[identifier.platform] = identifier.username
    }
    const platforms = await CallOfDutyAPI.Platforms(Object.values(profiles)[0], Object.keys(profiles)[0] as API.Schema.CallOfDuty.Platform)
    for(const platform in platforms) {
        profiles[platform] = platforms[platform].username
    }
    await db.collection('accounts').updateOne({ _id: player._id }, { $set: { games, profiles }})
    return { games, profiles }
}
