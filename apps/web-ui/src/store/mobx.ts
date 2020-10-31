import 'mobx-react-lite/batchingForReactDom'
import { observable } from 'mobx'
import { createContext } from 'react'
import { getUser } from 'src/hooks/getUser'

export interface UserStateModel {
    user?: UserModel
    oauth?: OAuthModel
}
export interface UserModel {
    userId?: string
    apiKey?: string
    created?: Date
}
export interface OAuthModel {
    discord?: OAuth.Discord
    callofduty?: OAuth.CallOfDuty
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
export class MobX {
    @observable private _userState:UserStateModel = getUser()
    get userState() { return this._userState }
    get loggedIn() { return Boolean(this._userState?.user?.userId) }
    refreshUserState() { this._userState = getUser() }
}
  
export const Context = createContext(new MobX)

  