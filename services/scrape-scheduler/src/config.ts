if (process.env.NODE_ENV === 'development') {
    require('dotenv').config()
}

export const COOLDOWN_SEC = 30 // once every 30s

export const MONGO_HOST = process.env.MONGO_HOST
export const MONGO_USER = process.env.MONGO_USER
export const MONGO_PASS = process.env.MONGO_PASS

export const FAAS_ETL_COD_HOST = process.env.STAGING__FAAS_ETL_COD_HOST

