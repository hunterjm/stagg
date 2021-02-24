import { useConfig } from '@stagg/gcp'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import { config } from './config'
import faas from '.'

async function startup() {
    const app = express()
    await useConfig(config)
    app.use(bodyParser.json())
    app.use('/', faas)
    app.listen(config.network.port.faas.render.html, () => {
        console.log(`[>] FaaS running on http://localhost:${config.network.port.faas.render.html}`)
    })
}
startup()
