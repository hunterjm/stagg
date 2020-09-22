import { Module } from '@nestjs/common'
import { CallOfDutyAccountModule } from 'src/callofduty/account/module'
import { RenderController } from 'src/render/controller'

@Module({
  providers: [],
  controllers: [
    RenderController
  ],
  imports: [CallOfDutyAccountModule],
})

export class RenderModule {}
