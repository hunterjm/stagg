import * as express from 'express'
import * as bodyParser from 'body-parser'
import { API_HOST } from './config'
import faas from '.'

const app = express()
app.use(bodyParser.json())
app.use('/', faas)
app.listen(8110, () => {
    console.log('[>] FaaS running on http://localhost:8110')
    console.log(`    Using API ${API_HOST}`)
})
