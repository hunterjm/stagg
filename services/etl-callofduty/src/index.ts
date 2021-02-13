import { Worker } from './worker'

// only need accountId
// fuck shit we don't need
// scrape EVERYTHING: supply account id
// logic to pull newest game: supply accountId

// fetch one thing, profile, batch of matches for account or user/platform

// ohcestrator that takes one account id, and it invokes this guy
// can be kicked off manually or with a scheduler

export default async (req, res) => {
    console.log('[+] ETL Request')
    const required = ['gameId', 'gameType', 'authTokens', 'startTime', 'username', 'platform']
    for(const field of required) {
        if (!req.body[field] && req.body[field] !== 0) {
            console.log('[!] Missing', field)
            return res.status(400).send({ error: `missing ${field}` })
        }
    }
    try {
        const Runner = new Worker.Instance(req.headers['x-integrity-jwt'], req.body, { redundancy: Boolean(req.params.redundancy) })
        await Runner.Run()
        res.status(200).send({ success: true })
    } catch(error) {
        console.log(error)
        res.status(500).send({ error })
    }
}
