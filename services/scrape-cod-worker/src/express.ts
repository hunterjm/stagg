import * as express from 'express'
import * as bodyParser from 'body-parser'
import faas from '.'

const app = express()
app.use(bodyParser.json())
app.use('/', faas)
app.listen(8087, () => {
    console.log('[>] FaaS running on http://localhost:8087')
})
