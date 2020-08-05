import { IsEmail, IsNotEmpty } from 'class-validator'

export class OAuthCredentialsDTO {
    @IsEmail()
    email: string

    @IsNotEmpty()
    password: string
}
