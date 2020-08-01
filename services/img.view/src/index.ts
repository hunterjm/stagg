const htmlImg = require('node-html-to-image')
import * as cors from 'cors'
import * as express from 'express'
import cfg from './config'
import barracksView from './views/barracks'


// iw8_la_rpapa7
// iw8_ar_akilo47
// claymore_mp
// claymore_radial_mp
// https://www.callofduty.com/cdn/app/weapons/mw/icon_equipment_claymore.png

const app = express()
app.use(cors({ credentials: false })).listen(cfg.port, async () => {
    app.get('/', (req,res) => res.status(418).send({ teapot: true }))
    app.get('/health', (req,res) => res.status(200).send('ok'))
    app.get(`/render.png`, async function(req, res) {
        const image = await htmlImg({
          type: 'png',
          html: barracksView,
          content: { weaponId: 'la_rpapa7' }
        })
        res.writeHead(200, { 'Content-Type': 'image/png' })
        res.end(image, 'binary')
    })
    console.log(
        `${'\x1b[32m' /* green */}${'\x1b[1m' /* bright/bold */}`+
        `----------------------------------------------------------\n`+
        `| Stagg View Rendering Service\n`+
        `| http://localhost:${cfg.port}\n`+
        `----------------------------------------------------------${'\x1b[0m' /* reset */}`
    )
})
