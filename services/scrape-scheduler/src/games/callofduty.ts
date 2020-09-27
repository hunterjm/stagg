import axios from 'axios'
import { Schema } from '@stagg/callofduty'
import { useClient } from '../db'
import { WORKER_COD_HOST, UPDATE_COOLDOWN } from '../config'

export const triggerAll = async () => {
    const initAccts = await getInitializeAccountIds()
    for(const acct of initAccts) {
        initializeAccount(acct)
    }
    const { accounts, ledgers } = await getUpdateAccountIds()
    for(const acct of accounts) {
        updateAccount(acct, ledgers.find(l => String(l._id) === String(acct._id)))
    }
}

export const updateAccount = (acct:Schema.DB.Account, ledger?:any) => {
    const accountId = acct._id
    console.log('[^] Updating', accountId, 'at', WORKER_COD_HOST)
    for(const gameId of acct.games) {
        console.log('    Game:', gameId)
        for(const gameType of ['wz', 'mp']) {
            let oldestStart = 0
            if (ledger && ledger[gameId] && ledger[gameId][gameType]) {
                oldestStart = ledger[gameId][gameType]
            }
            console.log('      Type:', gameType)
            if (oldestStart) {
                axios.post(WORKER_COD_HOST, {
                    accountId,
                    gameId,
                    gameType,
                    retry: 3,
                    start: oldestStart,
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

export const getUpdateAccountIds = async ():Promise<{ledgers: any[], accounts:Schema.DB.Account[]}> => {
    const db = await useClient('callofduty')
    const minSelectedTime = Date.now() - UPDATE_COOLDOWN
    const accountLedgers = await db.collection('_ETL.ledger').find({ selected: { $lt: minSelectedTime } }, { _id: 1 } as any).toArray()
    const validAccountIds = accountLedgers.sort((a,b) => a.selected - b.selected).map(l => l._id)
    const validAccounts = await db.collection('accounts').find({ _id: { $in: validAccountIds } }).toArray()
    const validAccountIdStrs = validAccountIds.map(_id => String(_id))
    return {
        ledgers: accountLedgers,
        accounts: validAccounts.sort((a,b) => validAccountIdStrs.indexOf(String(a._id)) - validAccountIdStrs.indexOf(String(b._id)))
    }
}
