import * as DB from '@stagg/db'
import { getEnvSecret, getConfigJson } from '@stagg/gcp'
import { ConnectionOptions } from 'typeorm'
export const IS_DEV = process.env.NODE_ENV === 'development'

export const PORT = IS_DEV ? 8120 : Number(process.env.PORT) || 8080

export const CONFIG = {
    SUSPICION: null,
}
export const SECRETS = {
    POSTGRES_USER: '',
    POSTGRES_PASS: '',
    POSTGRES_SOCKETPATH: '',
    BOT_COD_AUTH_TOKENS: null,
}
export const initializeConfig = async () => {
    const {
        SUSPICION,
    } = await getConfigJson('functions-etl-cheaters.json')
    CONFIG.SUSPICION = SUSPICION
    SECRETS.POSTGRES_USER = await getEnvSecret('PGSQL_USER')
    SECRETS.POSTGRES_PASS = await getEnvSecret('PGSQL_PASS')
    SECRETS.POSTGRES_SOCKETPATH = await getEnvSecret('PGSQL_SOCKETPATH')
    SECRETS.BOT_COD_AUTH_TOKENS = JSON.parse(await getEnvSecret('BOT_COD_AUTH_TOKENS_JSON'))
}
export const useConnection = ():ConnectionOptions => ({
    type: 'postgres',
    host: IS_DEV ? '127.0.0.1' : SECRETS.POSTGRES_SOCKETPATH,
    username: SECRETS.POSTGRES_USER,
    password: SECRETS.POSTGRES_PASS,
    database: 'stagg',
    entities: [
        DB.CallOfDuty.WZ.Match.Entity,
        DB.CallOfDuty.WZ.Suspect.Entity,
    ]
})

