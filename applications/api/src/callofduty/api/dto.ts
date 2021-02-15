import { IsEmail, IsNotEmpty } from 'class-validator'

export class CallOfDutyAccountCredentials {
    @IsEmail()
    email: string

    @IsNotEmpty()
    password: string
}

