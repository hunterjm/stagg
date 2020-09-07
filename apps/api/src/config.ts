// .env is only used for local
require('dotenv').config()

export const PORT = process.env.PORT || 8080
export const JWT_SECRET = process.env.JWT_SECRET

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
