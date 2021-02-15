import {
    Post,
    Body,
    Controller,
    UnauthorizedException,
} from '@nestjs/common'
import API from '@callofduty/api'
import { Tokens } from '@callofduty/types'
import { CallOfDutyAccountCredentials } from './dto'

@Controller('/callofduty/api')
export class CallOfDutyPassthroughAPI {
    constructor() {}
    @Post('/authorize')
    async ExchangeCredentials(@Body() { email, password }:CallOfDutyAccountCredentials):Promise<Tokens> {
        const api = new API()
        try {
            const tokens = await api.Authorize(email, password) // will throw if fail
            return tokens
        } catch(e) {
            throw new UnauthorizedException(e)
        }
    }

}
