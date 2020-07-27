import * as jwt from 'jsonwebtoken'
import * as gmailSend from 'gmail-send'
import * as templates from './templates'

let cfg:Config

export const config = (c:Config) => {
    cfg = c
    return { send }
}
export interface Config {
    gmailUser:string
    gmailPass:string
    jwtSecret:string
}

export namespace send {
    export const generic = (to:string, subject:string, html:string) => new Promise((resolve,reject) => {
        gmailSend({
            to,
            subject,
            user: cfg.gmailUser,
            pass: cfg.gmailPass,
        })({ html }, (error, result, fullResult) => error ? reject(error) : resolve({ result, fullResult }))
        console.log(`[>] Mail: sent "${subject}" to ${to}`)
    })

    export namespace confirmation {
        export const discord = async (email:string, username:string, discord:{id:string, tag:string, avatar:string}):Promise<boolean> => {
            const token = jwt.sign({ email, profiles: { uno: username }, discord: { id: discord.id } }, cfg.jwtSecret)
            const emailHTML = templates.confirm.discord({
                discord,
                username,
                jwt: Buffer.from(token).toString('base64'),
            })
            try {
                await send.generic(email, 'Confirm your email address for Stagg.co', emailHTML)
                return true
            } catch(e) {
                console.log('[!] Email confirmation failed', e)
                return false
            }
        }
    }
}
