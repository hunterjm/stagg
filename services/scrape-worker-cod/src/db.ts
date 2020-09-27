import * as MongoDB from 'mongodb'
import { MONGO_HOST, MONGO_USER, MONGO_PASS } from './config'

const CONNECTION_CONFIG = { useNewUrlParser: true, useUnifiedTopology: true }
const connectionStr = (
    db:string='stagg',
    host:string=MONGO_HOST,
    user:string=MONGO_USER,
    pass:string=MONGO_PASS,
):string => `mongodb+srv://${user}:${pass}@${host}/${db}?retryWrites=true&w=majority`

const connectedClient:MongoDB.MongoClient = new MongoDB.MongoClient(connectionStr(), CONNECTION_CONFIG)
export const useClient = async (db:string):Promise<MongoDB.Db> => {
    if (!connectedClient.isConnected()) {
        await connectedClient.connect()
        console.log(`[+] Connected to MongoDB...`)
    }
    return connectedClient.db(db)
}
