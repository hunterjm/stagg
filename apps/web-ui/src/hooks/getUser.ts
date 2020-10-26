import Cookies from 'js-cookie'
import * as JWT from 'jsonwebtoken'

export interface UserModel {
    userId?: string
    accounts?: {
        discord?: OAuth.Discord
        callofduty?: OAuth.CallOfDuty
    }
}
export interface DomainAccount {
    domainId: string
    accountId: string
}
export namespace OAuth {
    export interface Discord {
        state: string
        token: string
        id?: string
        tag?: string
        avatar?: string
    }
    export interface CallOfDuty {
        accountId?: string
        email: string
        games: string[]
        auth: { sso: string, xsrf: string, atkn: string }
        profiles: { platform: string, username: string }[]
    }
}
const getDiscordAccountCookies = () => {

}
const getDiscordOAuthCookies = ():OAuth.Discord => {
    const jwt = Cookies.get('jwt.discord')
    try {
        return JWT.decode(jwt) as OAuth.Discord
    } catch(e) {
        return null
    }
}
const getCallOfDutyOAuthCookies = () => {
    
}
const getCallOfDutyAccountCookies = () => {

}
export const getUser = ():UserModel => {
    const accounts = {
        discord: getDiscordOAuthCookies()
    }
    return { accounts }
}
