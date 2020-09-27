import { delay } from '@stagg/util'
import { triggerAll as triggerCod } from './games/callofduty'

export default async (req, res) => {
    for(let i = 0; i < 60; i++) {
        await triggerCod()
        await delay(1500)
    }
    res.status(200).send({ success: true })
}
