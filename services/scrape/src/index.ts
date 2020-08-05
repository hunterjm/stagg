import * as cors from 'cors'
import * as express from 'express'
import * as API from '@stagg/api'
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
    // let total = 19500
    const db = await mdb.config(cfg.mongo).client('callofduty')
    // const { auth } = await db.collection('accounts').findOne({ auth: { $exists: true } })
    // const CallOfDutyAPI = new API.CallOfDuty(auth)
    // const matchIds = await db.collection('mw.mp.performances').distinct('matchId')
    // for(const matchId of matchIds.slice(total)) {
    //     total++
    //     console.log(`Fetching match events #${total}`)
    //     const matchEvents = await CallOfDutyAPI.MatchEvents(matchId)
    //     const existing = await db.collection('_raw.mw.mp.events').findOne({ matchId })
    //     if (!existing) {
    //         console.log(`Inserting match events for ${matchId}`)
    //         await db.collection('_raw.mw.mp.events').insertOne(matchEvents)
    //     }
    // }
    cod.initializeNewPlayers()
    cod.updateExistingPlayers()
    cod.recheckExistingPlayers()
    cod.initializeArtificialPlayers()
})

