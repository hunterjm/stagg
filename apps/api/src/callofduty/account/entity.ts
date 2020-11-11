import { Schema } from 'callofduty'
export { Account, AccountDAO } from './entities/account'
export { AccountAuth, AccountAuthDAO } from './entities/account.auth'
export { AccountProfile, AccountProfileDAO } from './entities/account.profile'
export interface AccountModel {
    accountId:string
    userId:string
    unoId:string
    authId:string
    profiles:Schema.ProfileId.PlatformId[]
    games:Schema.Game[]
    email:string
    tokens:Schema.Tokens
}
