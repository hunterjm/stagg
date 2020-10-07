// .env is only used for local
require('dotenv').config()

const isDev = process.env.NODE_ENV === 'development'

export const PORT = process.env.PORT || 8080
export const JWT_SECRET = process.env.JWT_SECRET

export const SELF_HOST = isDev ? `http://localhost:${PORT}` : 'https://api.stagg.co'

export const GMAIL_ADDRESS = process.env.GMAIL_ADDRESS
export const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD

export const DISCORD_BOT_USER_ID = isDev ? '738240182670589993' : '723179755548967027'
export const DISCORD_TOKEN = process.env.DISCORD_TOKEN
export const DISCORD_SERVER_ID = '729780289727102976'
export const DISCORD_INVITE_URL = 'https://discord.gg/WhWrbY8'

export const FAAS_URL = {
    RENDER_HTML: isDev ? 'http://localhost:8089' : 'https://us-east1-stagcp.cloudfunctions.net/render-html'
}

export namespace Postgres {
    export const HOST = process.env.POSTGRES_HOST
    export const PORT = Number(process.env.POSTGRES_PORT)
    export const USER = process.env.POSTGRES_USER
    export const PASS = process.env.POSTGRES_PASS
}

export const POSTGRES = {
    HOST: Postgres.HOST,
    PORT: Postgres.PORT,
    USER: Postgres.USER,
    PASS: Postgres.PASS,
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
