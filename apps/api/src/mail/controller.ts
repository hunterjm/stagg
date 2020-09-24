import {
    Req,
    Res,
    Get,
    Param,
    Controller,
    BadRequestException
} from '@nestjs/common'
import { MailService } from 'src/mail/services'

@Controller('/mail')
export class MailController {
    constructor(
        private readonly mailService: MailService
    ) {}
    @Get('/test')
    async SendDiscordCode(@Req() req, @Res() res, @Param() { userId }):Promise<any> {
        // await this.mailService.sendDiscordCode('mardanlin@gmail.com', '318726630971408384')
        return 'sent'
    }
}