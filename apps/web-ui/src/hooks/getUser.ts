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
        id: string
        tag: string
        avatar: string
    }
    export interface CallOfDuty {
        email: string
        games: string[]
        profiles: { platform: string, username: string }[]
        authTokens: { sso: string, xsrf: string, atkn: string }
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
const getCallOfDutyOAuthCookies = ():OAuth.CallOfDuty => {
    const jwt = Cookies.get('jwt.callofduty')
    try {
        return JWT.decode(jwt) as OAuth.CallOfDuty
    } catch(e) {
        return null
    }
}
const getCallOfDutyAccountCookies = () => {

}
export const getUser = ():UserModel => {
    const accounts = {
        discord: getDiscordOAuthCookies(),
        callofduty: getCallOfDutyOAuthCookies(),
    }
    return { accounts }
}
