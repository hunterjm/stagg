import axios from 'axios'
import { config } from './config'
const htmlImg = require('node-html-to-image')

const deriveNumericalOption = (queryParamValue:string, defaultValue:number, min=1):number => {
  if (!queryParamValue) {
    return defaultValue
  }
  const numericalInput = Number(queryParamValue)
  if (isNaN(numericalInput) || numericalInput < min) {
    return defaultValue
  }
  return numericalInput
}

export default async function RenderHTML(req, res) {
    const url = req?.headers['x-render-url'] || req?.query?.url
    if (!url) {
      return res.writeHead(403).end('missing url')
    }
    const queryParams = []
    for(const param in req.query) {
      if (['f', 'url', 'width', 'height'].includes(param)) continue
      queryParams.push(`${param}=${req.query[param]}`)
    }
    const fetchableUrl = config.network.host.web + '/' + url.replace(/^\/+/g, '') + '?' + queryParams.join('&')
    if (!fetchableUrl) {
      return res.writeHead(403).end('invalid url')
    }
    console.log('[+] Rendering', fetchableUrl)
    const { data } = await axios.get(fetchableUrl, { headers: { 'x-render-report': true } })
    const absolutePathsHtml = data.split('="/').join(`="${config.network.host.web}/`)
    const image = await htmlImg({
      html: absolutePathsHtml,
      type: 'jpeg',
      quality: deriveNumericalOption(req?.query?.quality, 90),
      content: {},
      puppeteerArgs: {
        product: 'chrome',
        defaultViewport: {
          width: deriveNumericalOption(req?.query?.width, 800),
          height: deriveNumericalOption(req?.query?.height, 600),
        }
      }
    })
    res.writeHead(200, { 'Content-Type': 'image/jpeg', 'Cache-Controler': 'no-cache' })
    res.end(image, 'binary')
}
