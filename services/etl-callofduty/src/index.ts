import { Worker } from './worker'

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
