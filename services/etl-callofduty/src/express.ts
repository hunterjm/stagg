import * as express from 'express'
import * as bodyParser from 'body-parser'
import faas from '.'
import { createConnection } from 'typeorm'
import { CallOfDuty } from '@stagg/db'

createConnection({
    "type": "postgres",
    "host": "127.0.0.1",
    "port": 5432,
    "username": "postgres",
    "password": "",
    database: 'callofduty',
    entities: [ 
        CallOfDuty.Account.Base.Entity,
        CallOfDuty.Account.Auth.Entity,
        CallOfDuty.Account.Profile.Entity,
        CallOfDuty.Match.MW.MP.Detail.Entity,
        CallOfDuty.Match.MW.MP.Killstreak.Entity,
        CallOfDuty.Match.MW.MP.Loadout.Entity,
        CallOfDuty.Match.MW.MP.Objective.Entity,
        CallOfDuty.Match.MW.MP.Stats.Entity,
        CallOfDuty.Match.MW.MP.Weapon.Entity,
        CallOfDuty.Match.MW.WZ.Detail.Entity,
        CallOfDuty.Match.MW.WZ.Loadout.Entity,
        CallOfDuty.Match.MW.WZ.Objective.Entity,
        CallOfDuty.Match.MW.WZ.Stats.Entity,
    ]
}).then(() => {
    console.log(__dirname)
    console.log('[>] Connected to Stagg database!')
    const app = express()
    app.use(bodyParser.json())
    app.use('/', faas)
    app.listen(8110, () => {
        console.log('[>] FaaS running on http://localhost:8110')
    })
})
