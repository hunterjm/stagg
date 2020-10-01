import axios from 'axios'
import { ObjectId } from 'mongodb'
import { delay } from '@stagg/util'
import { Schema } from '@stagg/callofduty'
import { useClient } from '../db'
import { WORKER_COD_HOST, COOLDOWN_SEC } from '../config'


export const Run = async ():Promise<void> => {
    const firstPriorityAccts = await getFreshAccts()
    for(const acct of firstPriorityAccts) {
        if (!acct?.games?.length) {
            console.log(`[!] No games found for ${acct._id}`)
            continue
        }
        runAccount(acct._id, acct.games)
        await delay(100)
    }
    const secondPriorityAccts = await getStaleLedgers()
    for(const ledger of secondPriorityAccts) {
        const acct = await getAcctById(ledger._id)
        if (!acct?.games?.length) {
            console.log(`[!] No games found for ${ledger._id}`)
            continue
        }
        runAccount(ledger._id, acct.games, ledger)
        await delay(100)
    }
    console.log('firstPriorityAccts', firstPriorityAccts)
    console.log('secondPriorityAccts', secondPriorityAccts)
}

const getAcctById = async (_id:ObjectId):Promise<Schema.DB.Account> => {
    const db = await useClient('callofduty')
    return db.collection('accounts').findOne({ _id })
}
const getFreshAccts = async ():Promise<Schema.DB.Account[]> => {
    const db = await useClient('callofduty')
    const ledgerResults = await db.collection('_ETL.ledger').find({}).toArray()
    const ledgerAccountIds = ledgerResults.map(({ _id }) => _id)
    return db.collection('accounts').find({ _id: { $nin: ledgerAccountIds }, games: { $exists: true }, 'games.length': { $gt: 0 } }).toArray()
}
const getStaleLedgers = async ():Promise<any[]> => {
    const db = await useClient('callofduty')
    const selectedLimit = Date.now() - (COOLDOWN_SEC * 1000)
    return db.collection('_ETL.ledger').find({ selected: { $lt: selectedLimit } }, { _id: 1 } as any).sort({ selected: -1 }).toArray()
}

const runAccount = (accountId:ObjectId, games:Schema.API.Game[], ledger?:any) => {
    for(const game of games) {
        for(const gameType of ['wz', 'mp'] as Schema.API.GameType[]) {
            request(accountId, game, gameType)
            if (ledger && ledger[game] && ledger[game][gameType] && ledger[game][gameType].oldest) {
                const oldestStart = (ledger[game][gameType].oldest - 60) * 1000
                request(accountId, game, gameType, oldestStart)
            }
        }
    }
}

const request = (
    accountId:ObjectId,
    gameId:Schema.API.Game,
    gameType:Schema.API.GameType,
    start:number=0,
):Promise<any> => {
    console.log('[>] Requesting', WORKER_COD_HOST)
    return axios.post(WORKER_COD_HOST, {
        accountId,
        gameId,
        gameType,
        start,
        offset: 500,
        redundancy: false,
        delay: {
            success: 100,
            failure: 500,
        },
        include: {
            events: true,
            details: true,
            summary: true,
        },
    }).catch(e => console.log('[!] FaaS Failure'))
}
