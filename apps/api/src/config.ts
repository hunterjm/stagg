// .env is only used for local
require('dotenv').config()

export const IS_DEV = process.env.NODE_ENV === 'development'

export const PORT = process.env.PORT || 8080
export const JWT_SECRET = process.env.JWT_SECRET

export const WEB_HOST = IS_DEV ? 'http://localhost:8080' : 'https://stagg.co'
export const SELF_HOST = IS_DEV ? `http://localhost:${PORT}` : 'https://api.stagg.co'

export const GMAIL = {
    USER: process.env.GMAIL_USER,
    PASS: process.env.GMAIL_PASS,
}

export const DISCORD = {
    OAUTH: {
        SCOPE: 'identify',
        REDIRECT: `${WEB_HOST}/oauth/discord`,
        HOST: {
            IDENTIFY: `https://discord.com/api/v6/users/@me`,
            EXCHANGE: `https://discord.com/api/v6/oauth2/token`,
        }
    },
    SERVER: {
        ID: '729780289727102976',
        INVITE: 'https://discord.gg/WhWrbY8',
    },
    CLIENT: {
        ID: process.env.DISCORD_CLIENT_ID,
        TOKEN: process.env.DISCORD_CLIENT_TOKEN,
        SECRET: process.env.DISCORD_CLIENT_SECRET,
    },
    CHANNELS: {
        NOTIFY: {
            SYS: process.env.DISCORD_CHANNEL_NOTIFY_SYS
        }
    }
}

export const FAAS = {
    ETL_COD: process.env.FAAS_ETL_COD_HOST,
    RENDER_HTML: process.env.FAAS_RENDER_HTML_HOST,
    RENDER_CHART: process.env.FAAS_RENDER_CHART_HOST,
}

export const PGSQL = {
    USER: process.env.PGSQL_USER,
    PASS: process.env.PGSQL_PASS,
    PORT: Number(process.env.PGSQL_PORT),
    INSTANCE: process.env.PGSQL_INSTANCE,
    SOCKETPATH: process.env.PGSQL_SOCKETPATH,
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

