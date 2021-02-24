import { useConfig } from '@stagg/gcp'
import * as express from 'express'
import { config } from './config'
import faas from '.'

async function startup() {
    const app = express()
    await useConfig(config)
    app.use('/', faas)
    app.listen(config.network.port.faas.etl.cheaters, () => {
        console.log(`[>] FaaS running on http://localhost:${config.network.port.faas.etl.cheaters}`)
    })
}
startup()
