import { triggerAll as triggerCod } from './games/callofduty'

export default async (req, res) => {
    await triggerCod()
    res.status(200).send({ success: true })
}
