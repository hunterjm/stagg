import {
    Get,
    Controller,
    BadRequestException,
} from '@nestjs/common'
import { CallOfDutyAccountService } from './account/services'

@Controller('callofduty')
export class CallOfDutyController {
    constructor(
        private readonly acctSvcs: CallOfDutyAccountService,
    ) {}
    
    @Get('/etl')
    async ETL() {
        // etl all accts
        const allAccts = await this.acctSvcs.fetchAll()
        for(const acct of allAccts) {
            await this.acctSvcs.triggerETL(acct.accountId)
        }
    }

}
