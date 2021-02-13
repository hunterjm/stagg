import * as JWT from 'jsonwebtoken'
import {
    Ip,
    Get,
    Post,
    Body,
    Param,
    Controller,
    BadRequestException,
    BadGatewayException,
} from '@nestjs/common'
import { AccountCredentialsDTO } from './dto'
import { CallOfDutyAccountService } from './services'
import { JWT_SECRET } from 'src/config'

@Controller('callofduty/account')
export class CallOfDutyAccountController {
    constructor(
        private readonly acctSvcs: CallOfDutyAccountService,
    ) {}

    @Post('authorize')
    async ExchangeCredentials(
        @Ip() ip:string,
        @Body() body: AccountCredentialsDTO
    ) {
        try {
            const { email, tokens, games, profiles, unoId } = await this.acctSvcs.authorizationExchange(body.email, body.password)
            const accountModel = await this.acctSvcs.newSignIn(ip, email, tokens, games, profiles, unoId)
            const jwt = JWT.sign(accountModel, JWT_SECRET)
            return { jwt }
        } catch(e) {
            throw new BadGatewayException(e)
        }
    }
    
    @Get('/:accountId')
    async GetAccountModelByAccountId(@Param() { accountId }) {
        const model = await this.acctSvcs.buildModelForAccountId(accountId)
        delete model.tokens
        delete model.email
        delete model.authId
        return model
    }
    
    @Get('/user/:userId')
    async GetAccountModelByUserId(@Param() { userId }) {
        const [account] = await this.acctSvcs.findAllByUserId(userId)
        if (!account) {
            throw new BadRequestException('invalid user id')
        }
        const model = await this.acctSvcs.buildModelForAccountId(account.accountId)
        return this.acctSvcs.sanitizeModel(model)
    }
    
    @Get('/:platform/:username')
    async GetAccountModelByProfileId(@Param() { platform, username }) {
        const model = await this.acctSvcs.buildModelForProfile(username, platform)
        return this.acctSvcs.sanitizeModel(model)
    }
}
