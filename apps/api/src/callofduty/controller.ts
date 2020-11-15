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
    }

}
