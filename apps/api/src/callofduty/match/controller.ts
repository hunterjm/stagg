import { Foo, Schema } from '@stagg/callofduty'
import {
    Controller,
    Get,
    Put,
    Patch,
    Param,
} from '@nestjs/common'
// import { AccountLookupDAO } from 'src/callofduty/account/dao'
// import { CallOfDutyAccountService } from 'src/callofduty/account/services'

@Controller('callofduty/match')
export class CallOfDutyMatchController {
    constructor(
        // private readonly acctSrvc: CallOfDutyAccountService,
        // private readonly lookupDAO: AccountLookupDAO,
    ) {}

    @Get('/:matchId')
    async GetMatchDetails(@Param() { matchId }):Promise<{ success: boolean }> {
        const foo = new Foo()
        const bar:Foo.Bar = foo.bar()
        console.log(foo, bar)
        return { success: true }
    }

    @Get('/:matchId/:unoId')
    async GetMatchRecord(@Param() { unoId, matchId }):Promise<{ success: boolean }> {
        return { success: true }
    }

    @Put('/:matchId')
    async CreateMatch(@Param() { unoId, matchId }):Promise<{ success: boolean }> {
        return { success: true }
    }

    @Put('/:matchId/:unoId')
    async CreateMatchRecord(@Param() { unoId, matchId }):Promise<{ success: boolean }> {
        return { success: true }
    }

    @Patch('/:matchId/:unoId')
    async UpdateMatchRecord(@Param() { unoId, matchId }):Promise<{ success: boolean }> {
        return { success: true }
    }
}
