if (process.env.NODE_ENV === 'development') {
    require('dotenv').config()
}

export const DELAY_SUCCESS = 100
export const DELAY_FAILURE = 500

export const MONGO_HOST = process.env.MONGO_HOST
export const MONGO_USER = process.env.MONGO_USER
export const MONGO_PASS = process.env.MONGO_PASS

