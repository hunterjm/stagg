import * as cors from 'cors'
import * as express from 'express'
import * as mdb from '@stagg/mdb'
import * as cod from './callofduty'
import cfg from './config'
const app = express()
app.use(cors({ credentials: false })).listen(cfg.port, async () => {
    app.get('/', (req,res) => res.status(418).send({ teapot: true }))
    app.get('/health', (req,res) => res.status(200).send('ok'))
    console.log(
        `${'\x1b[32m' /* green */}${'\x1b[1m' /* bright/bold */}`+
        `----------------------------------------------------------\n`+
        `| Stagg Scraper Service\n`+
        `| http://localhost:${cfg.port}\n`+
        `----------------------------------------------------------${'\x1b[0m' /* reset */}`
    )
    
    // Init db connection so we don't have race condition and multiple connections
    await mdb.config(cfg.mongo).client('callofduty')
    cod.initializeNewPlayers()
    cod.updateExistingPlayers()
    cod.recheckExistingPlayers()
    cod.initializeArtificialPlayers()
})

