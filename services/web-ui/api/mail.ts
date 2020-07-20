import * as jwt from 'jsonwebtoken'
import * as Mongo from '@stagg/mdb'
import cfg from '../config/api'

Mongo.config(cfg.mongo)

export const confirm = async (req,res) => {
    const mongo = await Mongo.client()
    if (!req.query.jwt) return res.status(400).send({ error: 'jwt required' })
    try {
        const decoded = jwt.verify(req.query.jwt, cfg.jwt) as any
        if (!decoded || !decoded.email || !decoded.discord?.id) throw 'invalid jwt'
        const player = await mongo.collection('players').findOne({ email: decoded.email })
        if (!player) throw 'player not found'
        await mongo.collection('players').updateOne({ _id: player._id }, { $set: { discord: decoded.discord } })
        res.send({ success: true })
    } catch(e) {
        res.status(400).send({ success: false, error: 'invalid jwt' })
    }
}
