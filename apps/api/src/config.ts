// .env is only used for local
require('dotenv').config()

export const IS_DEV = process.env.NODE_ENV === 'development'

export const PORT = process.env.PORT || 8080
export const JWT_SECRET = process.env.JWT_SECRET

export const SELF_HOST = IS_DEV ? `http://localhost:${PORT}` : 'https://api.stagg.co'

export const GMAIL_ADDRESS = process.env.GMAIL_ADDRESS
export const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD

export const DISCORD_BOT_USER_ID = IS_DEV ? '738240182670589993' : '723179755548967027'
export const DISCORD_CLIENT_TOKEN = process.env.DISCORD_CLIENT_TOKEN
export const DISCORD_SERVER_ID = '729780289727102976'
export const DISCORD_INVITE_URL = 'https://discord.gg/WhWrbY8'

export const FAAS_URL = {
    RENDER_HTML: IS_DEV ? 'http://localhost:8089' : 'https://us-east1-stagcp.cloudfunctions.net/render-html'
}

export const FAAS = {
    ETL_COD: process.env.FAAS_ETL_COD_HOST,
    RENDER_HTML: process.env.FAAS_RENDER_HTML_HOST,
    RENDER_CHART: process.env.FAAS_RENDER_CHART_HOST,
}

export namespace Postgres {
    export const USER = process.env.PGSQL_USER
    export const PASS = process.env.PGSQL_PASS
    export const PORT = Number(process.env.PGSQL_PORT)
    export const INSTANCE = process.env.PGSQL_INSTANCE
    export const SOCKETPATH = process.env.PGSQL_SOCKETPATH
}

export const PGSQL = {
    USER: Postgres.USER,
    PASS: Postgres.PASS,
    PORT: Postgres.PORT,
    INSTANCE: Postgres.INSTANCE,
    SOCKETPATH: Postgres.SOCKETPATH,
    CODE: {
        DUPLICATE: 23505
    },
    FACTORY(database:string) {
        const baseConfig = {
            database,
            type: 'postgres',
            username: PGSQL.USER,
            password: PGSQL.PASS,
            entities: [
              'dist/**/*entity.js',
            ],
            synchronize: false,
        }
        return IS_DEV ? {
            ...baseConfig,
            extra: {
              socketPath: `${PGSQL.SOCKETPATH}/${PGSQL.INSTANCE}=tcp:${PGSQL.PORT}`
            },
        } : {
            ...baseConfig,
            port: PGSQL.PORT,
            host: `${PGSQL.SOCKETPATH}/${PGSQL.INSTANCE}`
        }
    }
}

export namespace Mongo {
    export const HOST = process.env.MONGO_HOST
    export const USER = process.env.MONGO_USER
    export const PASS = process.env.MONGO_PASS
}
export const MONGO = {
    HOST: Mongo.HOST,
    USER: Mongo.USER,
    PASS: Mongo.PASS,
    CONNECTION_STR(db:string):string {
        return `mongodb+srv://${Mongo.USER}:${Mongo.PASS}@${Mongo.HOST}/${db}?retryWrites=true&w=majority`
    }
}
