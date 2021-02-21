import { Route } from '@stagg/api'
import {
    Post,
    Body,
    Res,
    Get,
    Param,
    Query,
    Controller,
    BadRequestException,
} from '@nestjs/common'
import { AccountCredentialsDTO } from './dto'
import { FilterUrlQuery } from './filters'
import { CallOfDutyDB, CallOfDutyAPI } from './services'
import { AccountService } from 'src/account/services'
import { signJwt } from 'src/jwt'
import { denormalizeAccount } from 'src/account/model'

@Controller('/callofduty')
export class CallOfDutyController {
    constructor(
        private readonly acctService: AccountService,
        private readonly codDbService: CallOfDutyDB,
        private readonly codApiService: CallOfDutyAPI,
    ) {}

    @Post('/authorize')
    async ExchangeCredentials(@Res() res, @Body() { email, password }: AccountCredentialsDTO):Promise<Route.CallOfDuty.Authorization> {
        const tokens = await this.codApiService.authorizeCredentials(email, password)
        const { games, profiles: [ profile ] } = await this.codApiService.fetchIdentity(tokens)
        res.setHeader('Access-Control-Expose-Headers', 'X-Authorization-JWT, X-CallOfDuty-Provision-JWT')
        const responsePayload:Route.CallOfDuty.Authorization = {
            account: null,
            accountProvision: null,
            authorizationProvision: tokens
        }
        const existingAcct = await this.acctService.getByPlatformId(profile)
        if (existingAcct) {
            responsePayload.account = denormalizeAccount(existingAcct)
            res.setHeader('X-Authorization-JWT', signJwt(responsePayload))
        } else {
            const profiles = await this.codApiService.fetchAccounts(tokens, profile)
            responsePayload.accountProvision = { games, profiles }
            try {
                const { unoId } = await this.codApiService.fetchUnoId(tokens, profiles[0])
                responsePayload.accountProvision.unoId = unoId
            } catch(e) {}
            res.setHeader('X-CallOfDuty-Provision-JWT', signJwt(responsePayload))
        }
        res.send(responsePayload)
        return responsePayload
    }
    
    @Get('/:platform/:identifier')
    async FetchAccount(@Param() { platform, identifier }) {
        const account = await this.acctService.findAny(platform, identifier)
        if (!account) {
            throw new BadRequestException(`invalid profile ${platform}/${identifier}`)
        }
        return { account: denormalizeAccount(account) }
    }
    
    @Get('/:platform/:identifier/wz')
    async FetchAggregateMatchDataWZ(@Param() { platform, identifier }, @Query() query:FilterUrlQuery) {
        const account = await this.acctService.findAny(platform, identifier)
        if (!account) {
            throw new BadRequestException(`invalid profile ${platform}/${identifier}`)
        }
        const { rank, results } = await this.codDbService.wzAggregateMatchData(account.account_id, query)
        return { rank, account: denormalizeAccount(account), results }
    }
    
    @Get('/:platform/:identifier/wz/list')
    async FetchMatchHistoryDataWZ(@Param() { platform, identifier }, @Query() query:FilterUrlQuery) {
        const account = await this.acctService.findAny(platform, identifier)
        if (!account) {
            throw new BadRequestException(`invalid profile ${platform}/${identifier}`)
        }
        const { rank, results } = await this.codDbService.wzMatchHistoryData(account.account_id, query)
        return { rank, account: denormalizeAccount(account), results }
    }
    
}
