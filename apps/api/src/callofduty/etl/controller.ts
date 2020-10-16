import axios from 'axios'
import { Schema } from '@stagg/callofduty'
import {
    Controller,
    Get,
    Param,
} from '@nestjs/common'
import { FAAS } from 'src/config'

@Controller('callofduty/etl')
export class CallOfDutyEtlController {
    constructor(
    ) {}

    @Get('/:accountId')
    async AccountETL(@Param() { accountId }):Promise<{ success: boolean }> {
        const payload = {}
        await axios.post(FAAS.ETL_COD, payload, { headers: { 'x-integrity-jwt': '' } })
        return { success: true }
    }
}
