import { CONFIG } from 'src/config'
import { MessageHandler } from '../handlers/message'
import { Feature } from '.'

export class BarracksWZ implements Feature {
    public namespace:string = 'wz barracks'
    public async onMessage(handler:MessageHandler):Promise<void> {
        const [,, ...params] = handler.chain
        const span = { limit: null, skip: null }
        for(const i in params) {
            const param = params[i].trim()
            if (param.match(/^[0-9]{1,3}d?$/i)) {
                span[span.limit === null ? 'limit' : 'skip'] = param.replace(/[^0-9]/g, '')
                delete params[i]
            }
            if (param === 'me') {
                params[i] = handler.authorAccount.callofduty_uno_username
            }
        }
        const unoUsernames = [... new Set([...params, ...handler.accounts.map(a => a.callofduty_uno_username)])].filter(str => str)
        if (!unoUsernames.length) {
            unoUsernames.push(handler.authorAccount.callofduty_uno_username)
        }
        const spanParams = []
        if (span.limit !== null) {
            spanParams.push(`limit=${span.limit}`)
        }
        if (span.skip !== null) {
            spanParams.push(`skip=${span.skip}`)
        }
        const spanParamStr = !spanParams.length ? '' : `?${spanParams.join('&')}`
        for(const uname of unoUsernames) {
            const webUrl = `/${uname.replace('#', '@')}/wz/barracks${spanParamStr}`
            const imgUrl = `${webUrl}&width=1000&f=/${uname.replace('#', '_')}.wz.barracks.jpg`
            console.log('[>] Discord bot dispatching image from', `${CONFIG.HOST_RENDER_HTML}?url=${imgUrl}`)
            handler.reply({ content: `> ${CONFIG.HOST_WEB}${webUrl}`, files: [`${CONFIG.HOST_RENDER_HTML}?url=${imgUrl}`] })
        }
    }
}

