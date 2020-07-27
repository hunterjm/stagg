import * as Discord from 'discord.js'
import * as Mongo from '@stagg/mdb'
import { delay } from '@stagg/util'
import cfg from '../config'

(async () => {
    Mongo.config(cfg.mongo)
    const db = await Mongo.client('_log')
    while(true) {
        for(const item of queue) {
            if (item.method === 'insertOne') {
                await db.collection('discord').insertOne(item.payload)
            } else {
                await db.collection('discord').updateOne(item.query, item.payload)
            }
            queue.splice(0, 1)
        }
        await delay(100)
    }
})()

interface QueueItem {
    method: 'insertOne' | 'updateOne'
    payload: { [key:string]: any }
    query?: { [key:string]: any }
}
const queue:QueueItem[] = []

const create = async (m:Discord.Message) => {
    queue.push({
        method: 'insertOne',
        payload: {
            guildId: m.guild?.id || 'DM',
            channelId: m.channel?.id || 'DM',
            messageId: m.id,
            messageAuthor: m.author,
            messageContent: m.content,
            responseMessages: []
        }
    })
}

const link = async (m:Discord.Message, s:Discord.Message) => {
    queue.push({
        method: 'updateOne',
        payload: {
            $set: { responseId: s.id },
            $push: { responseMessages: s.content }
        },
        query: {
            messageId: m.id
        }
    })
}

const response = async (m:Discord.Message, response:string) => {
    queue.push({
        method: 'updateOne',
        payload: {
            $push: { responseMessages: response }
        },
        query: { $or: [{ messageId: m.id }, { responseId: m.id }] }
    })
}

export default {
    create,
    link,
    response
}
