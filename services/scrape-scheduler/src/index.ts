import { Run as RunCoD } from './games/callofduty'

export default async (req, res) => {
    await RunCoD()
    res.status(200).send({ success: true })
}
