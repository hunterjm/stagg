import {
    Get,
    Param,
    Query,
    Controller,
    BadRequestException,
} from '@nestjs/common'
import { AccountService } from 'src/account/services'
import { CallOfDutyDbService } from './services'
import { FilterUrlQuery } from './filters'
import { denormalizeAccount } from 'src/account/model'

@Controller('/callofduty/db')
export class CallOfDutyDataController {
    constructor(
        private readonly acctService: AccountService,
        private readonly codDbService: CallOfDutyDbService,
    ) {}
    
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
