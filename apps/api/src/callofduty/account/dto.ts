import { IsEmail, IsNotEmpty } from 'class-validator'
import { Schema } from 'callofduty'

export class AccountCredentialsDTO {
    @IsEmail()
    email: string

    @IsNotEmpty()
    password: string
}

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