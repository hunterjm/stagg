// .env is only used for local
require('dotenv').config()
export interface Config {
    port: number
    api: {
        retry: number
        delay: number
        failures: number
    }
    mongo: {
        db: string
        host: string
        user: string
        password: string
    }
    scrape: {
        wait: number
        cooldown: number
    }
}
export default {
    port: process.env.PORT || 8080,
    api: {
        retry: 3,
        delay: 100,
        failures: 3,
    },
    mongo: {
        host: process.env.MONGO_HOST,
        user: process.env.MONGO_USER,
        password: process.env.MONGO_PASS,
    },
    scrape: {
        wait: 3000,
        cooldown: 60000
    },
} as Config
