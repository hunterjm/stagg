import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import * as Entities from '@stagg/db'
import { getEnvSecret, getConfigJson } from '@stagg/gcp'
export const IS_DEV = process.env.NODE_ENV === 'development'

export const PORT = Number(process.env.PORT || 8081)

export const CONFIG = {
    HOST_WEB: '',
    HOST_ETL_ACCOUNT: '',
    HOST_RENDER_HTML: '',
    HOST_DISCORD_OAUTH_REDIRECT: '',
    HOST_DISCORD_OAUTH_IDENTIFY: '',
    HOST_DISCORD_OAUTH_EXCHANGE: '',
    DISCORD_CLIENT_ID: '',
    DISCORD_OAUTH_SCOPE: '',
    DISCORD_INITIAL_REPLY: [],
    DISCORD_INVALID_REPLY: [],
    DISCORD_HELP_REPLY: [],
    DISCORD_UNREGISTERED_REPLY: [],
    DISCORD_HELLO_MESSAGE: [],
    DISCORD_PROFILE_READY_MESSAGE: [],
    RANKING: null,
}

export const SECRETS = {
    JWT: '',
    DISCORD: '',
    DISCORD_TOKEN: '',
    POSTGRES_USER: '',
    POSTGRES_PASS: '',
    POSTGRES_SOCKETPATH: '',
    BOT_COD_AUTH_TOKENS: null,
}

export const useFactory = ():TypeOrmModuleOptions => ({
    type: 'postgres',
    database: 'stagg',
    username: SECRETS.POSTGRES_USER,
    password: SECRETS.POSTGRES_PASS,
    entities: [
      Entities.Account.Entity,
      Entities.Account.Repository,
      Entities.Discord.Log.Voice.Entity,
      Entities.Discord.Log.Message.Entity,
      Entities.Discord.Log.Response.Entity,
      Entities.Discord.Settings.Features.Entity,
      Entities.CallOfDuty.Friend.Entity,
      Entities.CallOfDuty.MW.Match.Entity,
      Entities.CallOfDuty.WZ.Match.Entity,
      Entities.CallOfDuty.WZ.Suspect.Entity,
      Entities.CallOfDuty.MW.Profile.Entity,
      Entities.CallOfDuty.MW.Profile.Mode.Entity,
      Entities.CallOfDuty.WZ.Profile.Mode.Entity,
      Entities.CallOfDuty.MW.Profile.Weapon.Entity,
      Entities.CallOfDuty.MW.Profile.Equipment.Entity,
    ],
    synchronize: false,
    host: IS_DEV ? '127.0.0.1' : SECRETS.POSTGRES_SOCKETPATH,
})

export const initializeConfig = async () => {
    const {
        RANKING,
        HOST_WEB,
        HOST_ETL_ACCOUNT,
        HOST_RENDER_HTML,
        HOST_DISCORD_OAUTH_REDIRECT,
        HOST_DISCORD_OAUTH_IDENTIFY,
        HOST_DISCORD_OAUTH_EXCHANGE,
        DISCORD_CLIENT_ID,
        DISCORD_OAUTH_SCOPE,
        DISCORD_INITIAL_REPLY,
        DISCORD_INVALID_REPLY,
        DISCORD_HELP_REPLY,
        DISCORD_UNREGISTERED_REPLY,
        DISCORD_HELLO_MESSAGE,
        DISCORD_PROFILE_READY_MESSAGE,
    } = await getConfigJson('applications-api.json')
    CONFIG.RANKING = RANKING
    CONFIG.HOST_WEB = HOST_WEB
    CONFIG.HOST_ETL_ACCOUNT = HOST_ETL_ACCOUNT
    CONFIG.HOST_RENDER_HTML = HOST_RENDER_HTML
    CONFIG.HOST_DISCORD_OAUTH_IDENTIFY = HOST_DISCORD_OAUTH_IDENTIFY
    CONFIG.HOST_DISCORD_OAUTH_REDIRECT = HOST_DISCORD_OAUTH_REDIRECT
    CONFIG.HOST_DISCORD_OAUTH_EXCHANGE = HOST_DISCORD_OAUTH_EXCHANGE
    CONFIG.DISCORD_CLIENT_ID = DISCORD_CLIENT_ID
    CONFIG.DISCORD_OAUTH_SCOPE = DISCORD_OAUTH_SCOPE
    CONFIG.DISCORD_INITIAL_REPLY = DISCORD_INITIAL_REPLY
    CONFIG.DISCORD_INVALID_REPLY = DISCORD_INVALID_REPLY
    CONFIG.DISCORD_HELP_REPLY = DISCORD_HELP_REPLY
    CONFIG.DISCORD_HELLO_MESSAGE = DISCORD_HELLO_MESSAGE
    CONFIG.DISCORD_PROFILE_READY_MESSAGE = DISCORD_PROFILE_READY_MESSAGE
    CONFIG.DISCORD_UNREGISTERED_REPLY = DISCORD_UNREGISTERED_REPLY
    SECRETS.JWT = await getEnvSecret('JWT_SECRET')
    SECRETS.DISCORD = await getEnvSecret('DISCORD_CLIENT_SECRET')
    SECRETS.DISCORD_TOKEN = await getEnvSecret('DISCORD_CLIENT_TOKEN')
    SECRETS.POSTGRES_USER = await getEnvSecret('PGSQL_USER')
    SECRETS.POSTGRES_PASS = await getEnvSecret('PGSQL_PASS')
    SECRETS.POSTGRES_SOCKETPATH = await getEnvSecret('PGSQL_SOCKETPATH')
    SECRETS.BOT_COD_AUTH_TOKENS = JSON.parse(await getEnvSecret('BOT_COD_AUTH_TOKENS_JSON'))
}
