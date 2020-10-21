import axios from 'axios'
import * as JWT from 'jsonwebtoken'
import {
    BadRequestException,
    Controller,
    Get,
    Param,
} from '@nestjs/common'
import { AccountDAO } from 'src/callofduty/account/entity'
import { CallOfDutyEtlService } from 'src/callofduty/etl/services'
import { FAAS, JWT_SECRET } from 'src/config'

@Controller('callofduty/etl')
export class CallOfDutyEtlController {
    constructor(
        private readonly acctDao: AccountDAO,
        private readonly etlService: CallOfDutyEtlService,
    ) {}

    @Get('/:accountId')
    async AccountETL(@Param() { accountId }):Promise<{ success: boolean }> {
        const acct = await this.acctDao.findById(accountId)
        if (!acct) {
            throw new BadRequestException('invalid account id')
        }
        if (!acct.auth.length) {
            throw new BadRequestException('can only run auth accounts')
        }
        this.etlService.triggerETL(acct)
        return { success: true }
    }
}
