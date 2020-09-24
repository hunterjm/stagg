import { Module } from '@nestjs/common'
import { WebHookService } from 'src/webhooks/services'
import { WebHooksController } from 'src/webhooks/controller'

@Module({
  imports: [],
  exports: [],
  providers: [WebHookService],
  controllers: [WebHooksController],
})

export class WebHooksModule {}
