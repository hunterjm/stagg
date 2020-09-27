if (process.env.NODE_ENV === 'development') {
    require('dotenv').config()
}

export const UPDATE_COOLDOWN = 1000 * 10 // once 10s
export const RECHECK_COOLDOWN = 1000 * 60 * 60 * 24 * 7 // once a week

export const MONGO_HOST = process.env.MONGO_HOST
export const MONGO_USER = process.env.MONGO_USER
export const MONGO_PASS = process.env.MONGO_PASS

export const WORKER_COD_HOST = process.env.NODE_ENV !== 'development'
    ? 'https://us-east1-stagcp.cloudfunctions.net/scrape-worker-cod'
    : 'http://localhost:8088'

