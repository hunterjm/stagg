import * as express from 'express'
import { PORT } from './config'
import faas from '.'

const app = express()
app.use('/', faas)
app.listen(PORT, () => {
    console.log(`[>] FaaS running on http://localhost:${PORT}`)
})
