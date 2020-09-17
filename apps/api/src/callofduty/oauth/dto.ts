import { IsEmail, IsNotEmpty } from 'class-validator'

export class CallOfDutyOAuthCredentialsDTO {
    @IsEmail()
    email: string

    @IsNotEmpty()
    password: string
}
