import { Module } from '@nestjs/common'
import { UserService } from 'src/user/services'

@Module({
  imports: [],
  exports: [UserService],
  providers: [UserService],
  controllers: [],
})

export class UserModule {}
