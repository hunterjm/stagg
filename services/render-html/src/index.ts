var fs = require('fs')
const htmlImg = require('node-html-to-image')
const commaNum = (num:number|string) => {
  const strNum = typeof num === typeof 'str' ? num as string : num.toString()
  const [whole, decimals] = strNum.split('.')
  const wholeWithCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return !decimals ? wholeWithCommas : `${wholeWithCommas}.${decimals}`
}

const dispatchMap = {
  'cod.mw.wz.barracks': {
    file: 'cod.mw.wz.barracks',
    normalize: {
      weaponId: (wid:string):string => wid.replace('iw8_', ''),
      timePlayed: (seconds:number):string => `${commaNum((seconds / 60  / 60).toFixed(1))}hr`,
      totalKills: (input:number):string => input.toFixed(2),
      weaponKills: (input:number):string => commaNum(input),
      totalWins: (input:number):string => commaNum(input),
      totalGames: (input:number):string => commaNum(input),
      totalRevives: (input:number):string => commaNum(input),
      totalFinalCircles: (input:number):string => commaNum(input),
      damagePerGame: (input:number):string => commaNum(Math.round(input)),
      scorePerMin: (input:number):string => commaNum(Math.round(input)),
      top10Percentage: (input:number):number => Math.round(input),
      gulagWinPercentage: (input:number):number => Math.round(input),
      timeMovingPercentage: (input:number):number => Math.round(input),
      killsPerDeath: (input:number):string => input.toFixed(2),
      killsPerGame: (input:number):string => input.toFixed(2),
      damageDonePerDamageTaken: (input:number):string => input.toFixed(2),
    }
  }
}

export default async function RenderHTML(req, res) {
    const mapKey = req.query.v || ''
    if (!mapKey) {
      return res.status(400).send({ error: 'bad request', message: 'no view specified' })
    }
    if (!dispatchMap[mapKey]) {
      return res.status(400).send({ error: 'bad request', message: `invalid view ${mapKey}` })
    }
    const { file, normalize } = dispatchMap[mapKey]
    const normalizedBody = req.body
    for(const key in normalizedBody) {
      if (normalize[key]) {
        normalizedBody[key] = normalize[key](normalizedBody[key])
      }
    }
    const html = fs.readFileSync(`${__dirname}/html/${file}.html`, 'utf8')
    const image = await htmlImg({
      html,
      type: 'png',
      content: normalizedBody
    })
    res.writeHead(200, { 'Content-Type': 'image/png' })
    res.end(image, 'binary')
}
