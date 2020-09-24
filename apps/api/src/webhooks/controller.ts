import { Get, Controller } from '@nestjs/common'

@Controller('/webhooks')
export class WebHooksController {
    constructor() {}
    @Get('/test')
    async Test():Promise<any> {
        return 'ok'
    }
}
