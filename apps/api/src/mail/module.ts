import { Module } from '@nestjs/common'
import { MailController } from 'src/mail/controller'
import { MailService } from 'src/mail/services'

@Module({
  imports: [],
  exports: [MailService],
  providers: [MailService],
  controllers: [MailController],
})

export class MailModule {}
