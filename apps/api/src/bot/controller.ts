import {
  Controller,
  Get,
  Param,
  BadRequestException,
} from '@nestjs/common'


@Controller('/discord/bot')
export class DiscordBotController {
    constructor() {}
    @Get('foo')
    async RenderChart(@Param() {}) {
      return ['']
    }
}
