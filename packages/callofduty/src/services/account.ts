import { Schema } from '..'

// Account sign-in
export enum SignInResult {
    Unauthorized,
    NewAccount,
    ExistingAccount,
    UnclaimedAccount,
    ArtificialAccount,
}
// Authenticate and create/check existing account separately?
// Must stash and return tokens + status
export async function SignIn(email:string, password:string):Promise<SignInResult> {
    return null
}

// Account creation
export async function CreateOrganicAccount(email:string):Promise<void> {

}
export async function CreateArtificialAccount(origin:Schema.DB.Account.Origin):Promise<void> {

}

// Account fetching
export async function FetchByEmail(email:string):Promise<Schema.DB.Account> {
    return null
}
export async function FetchByDiscordId(discordId:string):Promise<Schema.DB.Account> {
    return null
}
export async function FetchByAccountId(accountId:string):Promise<Schema.DB.Account> {
    return null
}
export async function FetchByPlatformId(username:string, platform:Schema.API.Platform):Promise<Schema.DB.Account> {
    return null
}

// Performance/match fetching
export async function FetchMatchIdsByAccountId(accountId:string):Promise<any> {
    return null
}
