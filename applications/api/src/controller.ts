import { Controller, Get } from '@nestjs/common'

@Controller('/')
export class RootController {
    constructor() {}
    @Get('/health')
    async HealthCheck():Promise<string> {
        return 'ok'
    }
}
