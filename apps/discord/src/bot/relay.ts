import * as Discord from 'discord.js'
import { commaNum } from '@stagg/util'
import logger from './logger'

type ExtendableMessage = Omit<Discord.Message, 'edit'>
interface Messenger extends ExtendableMessage {
    edit(output:string[]):void
    files(urls:string[]):Promise<void>
}

export default (m:Discord.Message, output:string[], options?:{ files: string[] }):Promise<Messenger> => {
    return new Promise(
        (resolve,reject) => {
            const formattedOutput = formatOutput(output)
            m.channel.send(formattedOutput, options).then(async sentMessage => {
                logger.link(m, sentMessage)
                resolve({
                    ...sentMessage,
                    edit: (output:any) => {
                        const formattedOutput = formatOutput(output)
                        sentMessage.edit(formattedOutput)
                        logger.response(m, formattedOutput)
                    },
                    files: (urls:string[]) => new Promise((resolve,reject) => {
                        m.channel.send('', { files: urls }).then(() => resolve())
                        logger.response(m, `files:${JSON.stringify(urls)}`)
                    }),
                    delete: () => sentMessage.delete()
                } as Messenger)
            }).catch(e => reject(e))
        }
    )
}

export const formatOutput = (linesArr:string[]) => truncate(linesArr.reduce((prev, curr) => prev + `> ${curr}\n`, ''))
const truncate = (output:string):string => {
    let truncatedResponse = output
    if (truncatedResponse.length > 2000) {
        const closingCodeTag = '...```'
        const truncatedDisclaimer = `\n> _Message truncated; original message ${commaNum(output.length)} chars long_`
        const baseIndex = 2000 - truncatedDisclaimer.length
        truncatedResponse = truncatedResponse.slice(0, baseIndex)
        const hasUnclosedCodeTag = !(truncatedResponse.split('```').length % 2)
        if (hasUnclosedCodeTag) truncatedResponse = truncatedResponse.slice(0, baseIndex - closingCodeTag.length) + closingCodeTag
        truncatedResponse += truncatedDisclaimer
    }
    return truncatedResponse
}
