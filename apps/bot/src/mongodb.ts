import * as Mongo from 'mongodb'

let cfg:Config
let mdbClients:{[key:string]:Mongo.MongoClient} = {} // db:client

export const config = (c:Config) => {
    cfg = c
    return { client }
}
export const client = async (db:string):Promise<Db> => {
    if (!cfg) throw new Error('MongoDB config not found')
    if (!mdbClients[db]) mdbClients[db] = new Mongo.MongoClient(
        `mongodb+srv://${cfg.user}:${cfg.password}@${cfg.host}/${db}?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    if (!mdbClients[db].isConnected()) {
        await mdbClients[db].connect()
        console.log(`[+] Connected to MongoDB ${cfg.host}/${db}`)
    }
    return mdbClients[db].db(db)
}

export type Db = Mongo.Db
export type Client = Mongo.MongoClient
export interface Config {
    host:string
    user:string
    password:string
}
