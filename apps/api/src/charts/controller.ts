import * as deprecatedRequest from 'request'
import {
  Controller,
  Get,
  Req,
  Res,
  Query,
  BadRequestException,
} from '@nestjs/common'


@Controller('/')
export class ChartsController {
    constructor() {}
    @Get('charts/:userDefinedSlug')
    async RenderChart(@Query() { c }, @Req() req, @Res() res):Promise<any> {
      if (!c) {
        throw new BadRequestException('chart params required')
      }
      req.pipe(deprecatedRequest(`https://us-east1-stagcp.cloudfunctions.net/render-chart?c=${c}`)).pipe(res)
    }
}
