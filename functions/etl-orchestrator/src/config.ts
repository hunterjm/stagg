import * as DB from '@stagg/db'
import { getEnvSecret, getConfigJson } from '@stagg/gcp'
import { ConnectionOptions } from 'typeorm'
export const IS_DEV = process.env.NODE_ENV === 'development'

export const PORT = IS_DEV ? 8100 : Number(process.env.PORT) || 8080

export const CONFIG = {
    INTERVAL_PREMIUM: 15,
    INTERVAL_STANDARD: 60,
    HOST_ETL_ACCOUNT: '',
}
export const SECRETS = {
    NETWORK_KEY: '',
    POSTGRES_USER: '',
    POSTGRES_PASS: '',
    POSTGRES_SOCKETPATH: '',
}
export const initializeConfig = async () => {
    const {
        INTERVAL_PREMIUM,
        INTERVAL_STANDARD,
        HOST_ETL_ACCOUNT,
    } = await getConfigJson('functions-etl-orchestrator.json')
    CONFIG.INTERVAL_PREMIUM = Number(INTERVAL_PREMIUM) || 15
    CONFIG.INTERVAL_STANDARD = Number(INTERVAL_STANDARD) || 60
    CONFIG.HOST_ETL_ACCOUNT = HOST_ETL_ACCOUNT
    SECRETS.NETWORK_KEY = await getEnvSecret('NETWORK_KEY')
    SECRETS.POSTGRES_USER = await getEnvSecret('PGSQL_USER')
    SECRETS.POSTGRES_PASS = await getEnvSecret('PGSQL_PASS')
    SECRETS.POSTGRES_SOCKETPATH = await getEnvSecret('PGSQL_SOCKETPATH')
}
export const useConnection = ():ConnectionOptions => ({
    type: 'postgres',
    host: IS_DEV ? '127.0.0.1' : SECRETS.POSTGRES_SOCKETPATH,
    username: SECRETS.POSTGRES_USER,
    password: SECRETS.POSTGRES_PASS,
    database: 'stagg',
    entities: [
        DB.Account.Entity,
        DB.CallOfDuty.Friend.Entity,
        DB.CallOfDuty.MW.Match.Entity,
        DB.CallOfDuty.MW.Profile.Entity,
        DB.CallOfDuty.MW.Profile.Mode.Entity,
        DB.CallOfDuty.WZ.Match.Entity,
        DB.CallOfDuty.WZ.Profile.Mode.Entity,
    ]
})

