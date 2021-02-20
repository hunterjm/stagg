import { createConnection } from 'typeorm'
import { useConnection, initializeConfig } from './config'
import { GlobalEventHandler } from './events'

let isConnected:boolean = false

const dbConnect = async () => {
    if (isConnected) return
    await createConnection(useConnection())
    console.log('[+] Connected, executing...')
    isConnected = true
}

export default async (req, res) => {
    await initializeConfig()
    await dbConnect()
    new GlobalEventHandler(req.body)
    res.status(200)
    res.send({ success: true })
    res.end()
}
