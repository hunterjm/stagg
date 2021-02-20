import * as express from 'express'
import * as bodyParser from 'body-parser'
import { PORT } from './config'
import faas from '.'

const app = express()
app.use(bodyParser.json())
app.use('/', faas)
app.listen(PORT, () => {
    console.log(`[>] FaaS running on http://localhost:${PORT}`)
})
