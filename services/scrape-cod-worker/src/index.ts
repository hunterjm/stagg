import * as mdb from '@stagg/mdb'
import { API, Schema, Normalize } from '@stagg/callofduty'
import * as Scraper from './scraper'
import cfg from './config'

mdb.config(cfg.mongo)

const cooldown = 60 * 60 * 24  * 7 // once a week

const modes = ['mp', 'wz'] as Schema.API.GameType[]
const timestamp = () => Math.round(new Date().getTime()/1000)
const playerLabel = (player:mdb.Schema.CallOfDuty.Account) => player.email || player.profiles.uno || 'artificial player'

async function updateExistingPlayers() {
    const db = await mdb.client('callofduty')
    const [ player ] = await db.collection('accounts')
        .find({ 'scrape.updated': { $exists: true }, 'scrape.initialized': { $exists: true } })
        .sort({ 'scrape.updated': 1 }).toArray()
    if (!player) {
        return // no players to update
    }
    console.log(`[+] Updating ${playerLabel(player)}`)
    try {
        await updateProfiles(player)
    } catch(e) {
        console.log('[!] Updating profile failure:', e)
    }
    for(const game of player.games) {
        for(const mode of modes) {
            const instance = new Scraper.Runners.Matches(player, { game, mode, start: 0, redundancy: false })
            await instance.ETL(cfg.mongo)
        }
    }
}

async function recheckExistingPlayers() {
    const db = await mdb.client('callofduty')
    const neverRechecked = await db.collection('accounts').findOne({ 'scrape.initialized': { $exists: true }, 'scrape.rechecked': { $exists: false } })
    const [ player ] = neverRechecked ? [neverRechecked]
        : await db.collection('accounts')
            .find({ 'scrape.initialized': { $exists: true }, 'scrape.rechecked': { $exists: true, $lt: timestamp() - cooldown } })
            .sort({ 'scrape.rechecked': 1 }).toArray()
    if (!player) {
        return // no players to recheck
    }
    await db.collection('accounts').updateOne({ _id: player._id }, { $set: { 'scrape.rechecked': timestamp() } })
    try {
        if (player.origin === 'self') {
            const { games, profiles } = await updateIdentity(player) // optional on recheck (checks for new games)
            player.games = games
            player.profiles = profiles
        }
        console.log(`[+] Rechecking ${playerLabel(player)}`)
        for(const game of player.games) {
            for(const mode of modes) {
                const instance = new Scraper.Runners.Matches(player, { game, mode, start: 0, redundancy: true })
                await instance.ETL(cfg.mongo)
            }
        }
    } catch(e) {
        console.log('[!] Recheck failed for', player.email, e)
    }
}

async function initializeNewPlayers() {
    const db = await mdb.client('callofduty')
    const player = await db.collection('accounts').findOne({ origin: 'self', 'scrape.initialized': { $exists: false }, initFailure: { $exists: false } })
    if (!player) {
        return // no new players to initialize
    }
    try {
        const { games, profiles } = await updateIdentity(player) // required on initialize
        player.games = games
        player.profiles = profiles
        await initializeAny(player)
        await db.collection('accounts').updateOne({ _id: player._id }, { $set: { 'scrape.initialized': timestamp() } })
    } catch(e) {
        // This can fail if they have no titleIdentities returned, so signal in the db to skip for now
        await db.collection('accounts').updateOne({ _id: player._id }, { $set: { initFailure: true } })
    }
}

async function initializeArtificialProfiles() {
    const db = await mdb.client('callofduty')
    const player = await db.collection('accounts').findOne({
        origin: { $nin: ['self'] },
        games: { $exists: true },
        profiles: { $exists: true },
        'scrape.initialized': { $exists: false },
    })
    if (!player) {
        return // no new players to initialize
    }
    try {
        await initializeAny(player)
        await db.collection('accounts').updateOne({ _id: player._id }, { $set: { 'scrape.initialized': timestamp() } })
    } catch(e) {
        // This can fail if they have no titleIdentities returned, so signal in the db to skip for now
        await db.collection('accounts').updateOne({ _id: player._id }, { $set: { initFailure: true } })
    }
}

async function initializeAny(player:mdb.Schema.CallOfDuty.Account) {
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

async function updateProfiles(player:mdb.Schema.CallOfDuty.Account) {
    const db = await mdb.client('callofduty')
    const CallOfDutyAPI = new API(player.auth)
    const gamesWithProfiles = ['mw']
    // No profiles for BO4 it will break
    for(const game of player.games.filter(g => gamesWithProfiles.includes(g))) {
        const gameProfile = await CallOfDutyAPI.Profile(player.profiles.id || player.profiles.uno, 'uno', 'mp', game)
        const existing = await db.collection(`${game}.profiles`).findOne({ _player: player._id })
        if (!existing) {
            console.log('[+] Saving new profile for UnoID', player.profiles.id)
            await db.collection(`${game}.profiles`).insertOne({ _player: player._id, updated: new Date(), ...Normalize.MW.Profile(gameProfile) })
        } else {
            console.log('[>] Updating profile for UnoID', player.profiles.id)
            await db.collection(`${game}.profiles`).updateOne({ _player: player._id }, { $set: { _player: player._id, updated: new Date(), ...Normalize.MW.Profile(gameProfile) } })
        }
    }
}

async function updateIdentity(player:mdb.Schema.CallOfDuty.Account) {
    const db = await mdb.client('callofduty')
    const games:string[] = []
    const profiles:{[key:string]:string} = {}
    const CallOfDutyAPI = new API(player.auth)
    const identity = await CallOfDutyAPI.Identity()
    for(const identifier of identity.titleIdentities) {
        games.push(identifier.title)
        profiles[identifier.platform] = identifier.username
    }
    const platforms = await CallOfDutyAPI.Platforms(Object.values(profiles)[0], Object.keys(profiles)[0] as Schema.API.Platform)
    for(const platform in platforms) {
        profiles[platform] = platforms[platform].username
    }
    await db.collection('accounts').updateOne({ _id: player._id }, { $set: { games, profiles }})
    return { games, profiles }
}

async function runner() {
    await mdb.client('callofduty')
    await Promise.all([ initializeNewPlayers(), updateExistingPlayers(), initializeArtificialProfiles(), recheckExistingPlayers() ])
}

export default async (req, res) => {
    await runner()
    res.status(200).send({ success: true })
}
