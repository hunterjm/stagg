import { useClient } from './db'
import { Instance } from './scrape'

export default async (req, res) => {
    if (!req.body.accountId) {
        return res.status(400).send({ error: 'missing accountId' })
    }
    if (!req.body.gameId) {
        return res.status(400).send({ error: 'missing gameId' })
    }
    if (!req.body.gameType) {
        return res.status(400).send({ error: 'missing gameType' })
    }
    try {
        const options = {
            retry: 3,
            start: 0,
            summary: false,
            delay: {
                success: 100,
                failure: 500,
            },
            ...req.body,
        }
        await useClient('callofduty')
        const Runner = new Instance(options)
        await Runner.ETL(req.body.accountId)
        res.status(200).send({ success: true })
    } catch(error) {
        console.log(error)
        res.status(500).send({ error })
    }
}
