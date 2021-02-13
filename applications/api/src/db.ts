import { createConnection } from 'typeorm'
import { useFactory } from './config'

let isConnected:boolean = false

export const dbConnect = async () => {
    if (isConnected) return
    const connection = <any>useFactory()
    await createConnection(connection)
    isConnected = true
}
