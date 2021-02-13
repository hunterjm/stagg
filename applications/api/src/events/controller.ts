import {
    Get,
    Param,
    Controller,
    BadRequestException,
} from '@nestjs/common'
import { AccountService } from 'src/account/services'
import { BotService } from 'src/bot/services'
import { CONFIG } from 'src/config'

@Controller('/events')
export class EventsController {
    constructor(
        private readonly botService: BotService,
        private readonly acctService: AccountService,
    ) {}
    @Get('/account/:account_id/ready')
    async AccountReady(@Param() { account_id }) {
        const acct = await this.acctService.getById(account_id)
        if (!acct) {
            throw new BadRequestException('invalid account_id')
        }
        await this.botService.messageUser(acct.discord_id, CONFIG.DISCORD_PROFILE_READY_MESSAGE)
        return { success: true }
    }
}