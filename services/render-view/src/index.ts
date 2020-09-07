const htmlImg = require('node-html-to-image')
import barracksView from './views/barracks'

// iw8_la_rpapa7
// iw8_ar_akilo47
// claymore_mp
// claymore_radial_mp
// https://www.callofduty.com/cdn/app/weapons/mw/icon_equipment_claymore.png

export default async function RenderHTML(req, res) {
    const image = await htmlImg({
      type: 'png',
      html: barracksView,
      content: { weaponId: 'la_rpapa7' }
    })
    res.writeHead(200, { 'Content-Type': 'image/png' })
    res.end(image, 'binary')
}
