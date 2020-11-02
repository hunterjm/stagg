import { IsEmail, IsNotEmpty } from 'class-validator'

export class AccountCredentialsDTO {
    @IsEmail()
    email: string

    @IsNotEmpty()
    password: string
}
