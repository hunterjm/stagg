import axios from 'axios'
import { Schema } from '@stagg/callofduty'
import { useClient } from '../db'
import { WORKER_COD_HOST, UPDATE_COOLDOWN } from '../config'

export const triggerAll = async () => {
    const initAccts = await getInitializeAccountIds()
    for(const acct of initAccts) {
        initializeAccount(acct)
    }
    const updateAccts = await getUpdateAccountIds()
    for(const acct of updateAccts) {
        updateAccount(acct)
    }
}

export const updateAccount = (acct:Schema.DB.Account) => {
    const accountId = acct._id
    console.log('[^] Updating', accountId, 'at', WORKER_COD_HOST)
    for(const gameId of acct.games) {
        console.log('    Game:', gameId)
        for(const gameType of ['wz', 'mp']) {
            console.log('      Type:', gameType)
            axios.post(WORKER_COD_HOST, {
                accountId,
                gameId,
                gameType,
                retry: 3,
                start: 0,
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
    }
}

export const initializeAccount = (acct:Schema.DB.Account) => {
    const accountId = acct._id
    console.log('[+] Initializing', accountId, 'at', WORKER_COD_HOST)
    for(const gameId of acct.games) {
        console.log('    Game:', gameId)
        for(const gameType of ['wz', 'mp']) {
            console.log('    Type:', gameType)
            axios.post(WORKER_COD_HOST, {
                accountId,
                gameId,
                gameType,
                retry: 3,
                start: 0,
                offset: 500,
                redundancy: true,
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
    }
}

export const getInitializeAccountIds = async ():Promise<Schema.DB.Account[]> => {
    const db = await useClient('callofduty')
    const accounts = await db.collection('accounts').find({}, { _id: 1 } as any).toArray()
    const accountIds = accounts.map(a => a._id)
    const accountLedgers = await db.collection('_ETL.ledger').find({ _id: { $in: accountIds } }, { _id: 1 } as any).toArray()
    const ledgerAccountIdStrs = accountLedgers.map(l => String(l._id))
    return accounts.filter(a => !ledgerAccountIdStrs.includes(String(a._id)))
}

export const getUpdateAccountIds = async ():Promise<Schema.DB.Account[]> => {
    const db = await useClient('callofduty')
    const minSelectedTime = Date.now() - UPDATE_COOLDOWN
    const accountLedgers = await db.collection('_ETL.ledger').find({ selected: { $lt: minSelectedTime } }, { _id: 1 } as any).toArray()
    const validAccountIds = accountLedgers.sort((a,b) => a.selected - b.selected).map(l => l._id)
    const validAccounts = await db.collection('accounts').find({ _id: { $in: validAccountIds } }).toArray()
    const validAccountIdStrs = validAccountIds.map(_id => String(_id))
    return validAccounts.sort((a,b) => validAccountIdStrs.indexOf(String(a._id)) - validAccountIdStrs.indexOf(String(b._id)))
}
