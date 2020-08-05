// .env is only used for local
require('dotenv').config()

export const PORT = process.env.PORT || 8080
export const MONGO = {
    HOST: process.env.MONGO_HOST,
    USER: process.env.MONGO_USER,
    PASS: process.env.MONGO_PASS,
}
