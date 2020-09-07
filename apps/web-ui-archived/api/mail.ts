import * as jwt from 'jsonwebtoken'
import * as Mongo from '@stagg/mdb'
import cfg from '../config/api'

Mongo.config(cfg.mongo)

export const confirm = async (req,res) => {
    const db = {
        cod: await Mongo.client('callofduty'),
        stagg: await Mongo.client('stagg')
    }
    if (!req.query.jwt) return res.status(400).send({ error: 'jwt required' })
    try {
        const decoded = jwt.verify(req.query.jwt, cfg.jwt) as any
        if (!decoded || !decoded.email || !decoded.discord?.id) throw 'invalid jwt'
        const player = await db.cod.collection('accounts').findOne({ email: decoded.email })
        if (!player) throw 'player not found'
        await db.stagg.collection('users').updateOne({ 'accounts.callofduty': player._id }, { $set: { discord: decoded.discord } })
        res.send({ success: true })
    } catch(e) {
        res.status(400).send({ success: false, error: 'invalid jwt' })
    }
}
