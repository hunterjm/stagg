import * as DB from '@stagg/db'
import { getEnvSecret, getConfigJson } from '@stagg/gcp'
import { ConnectionOptions } from 'typeorm'

export const IS_DEV = process.env.NODE_ENV === 'development'
export const PORT = IS_DEV ? 8110 : Number(process.env.PORT) || 8080

export const CONFIG = {
    SELF_HOST: '',
    API_HOST: '',
    HOST_ETL_CHEATERS: '',
    MAX_EXECUTION_TIME: 500
}
export const SECRETS = {
    POSTGRES_USER: '',
    POSTGRES_PASS: '',
    POSTGRES_SOCKETPATH: '',
}
export const initializeConfig = async () => {
    const { MAX_EXECUTION_TIME, SELF_HOST, HOST_ETL_CHEATERS, API_HOST } = await getConfigJson('functions-etl-account.json')
    CONFIG.API_HOST = API_HOST
    CONFIG.SELF_HOST = SELF_HOST
    CONFIG.HOST_ETL_CHEATERS = HOST_ETL_CHEATERS
    CONFIG.MAX_EXECUTION_TIME = Number(MAX_EXECUTION_TIME) || 500
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
        DB.CallOfDuty.MW.Profile.Weapon.Entity,
        DB.CallOfDuty.MW.Profile.Equipment.Entity,
    ]
})
