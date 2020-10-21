import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User, UserDAO } from 'src/user/entity'
import { UserService } from 'src/user/services'
import { StaggDbModule } from 'src/module.db'
import { CallOfDutyAccountModule } from 'src/callofduty/account/module'

@Module({
  imports: [
    StaggDbModule,
    CallOfDutyAccountModule,
    TypeOrmModule.forFeature([User], 'stagg'),
  ],
  exports: [UserService, UserDAO],
  providers: [UserService, UserDAO],
  controllers: [],
})

export class UserModule {}
