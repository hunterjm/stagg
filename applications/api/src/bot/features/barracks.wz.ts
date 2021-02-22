import { CONFIG } from 'src/config'
import { MessageHandler, format } from '../handlers/message'
import { Feature } from '.'

export class BarracksWZ implements Feature {
    public namespace:string = 'wz'
    public getParams(chain:string[]) {
        const namespaceParams = this.namespace.split(' ').filter(n => n)
        return chain.slice(namespaceParams.length)
    }
    public async onMessage(handler:MessageHandler):Promise<void> {
        const params = this.getParams(handler.chain)
        const span = { limit: null, skip: null }
        for(const i in params) {
            const param = params[i].trim()
            if (param.match(/^[0-9]{1,3}(d|m)?$/i)) {
                span[span.limit === null ? 'limit' : 'skip'] = param
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
        for(const uname of unoUsernames) {
            const playerUrl = `/${uname.replace('#', '@')}/wz/barracks`
            const profileLinkUrl = CONFIG.HOST_WEB + playerUrl + `?${spanParams.join('&')}`
            const renderHtmlUrl = `${CONFIG.HOST_RENDER_HTML}?url=${playerUrl}&${spanParams.join('&')}`
            const renderHtmlUrlFinal =  `${renderHtmlUrl}&width=1000&f=/${uname.replace('#', '_')}.wz.barracks.jpg`
            const unameCmd = `% wz ${uname}${span.limit ? ` ${span.limit}` : ''}${span.skip ? ` ${span.skip}` : ''}`
            console.log('[>] Discord bot dispatching image from', renderHtmlUrlFinal)
            handler.reply({ content: format(['```', '', unameCmd, '', '```'+profileLinkUrl]), files: [renderHtmlUrlFinal] })
        }
    }
}

export class AliasBarracksWZ extends BarracksWZ {
    public namespace:string = 'wz barracks'
}

