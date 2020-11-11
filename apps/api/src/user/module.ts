import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DiscordModule } from 'src/discord/module'
import { User, UserDAO } from 'src/user/entity'
import { UserService } from 'src/user/services'
import { UserController } from 'src/user/controller'
import { StaggDbModule } from 'src/module.db'
import { CallOfDutyAccountModule } from 'src/callofduty/account/module'

@Module({
  imports: [
    StaggDbModule,
    forwardRef(() => DiscordModule),
    forwardRef(() => CallOfDutyAccountModule),
    TypeOrmModule.forFeature([User], 'stagg'),
  ],
  exports: [UserService, UserDAO],
  providers: [UserService, UserDAO],
  controllers: [UserController],
})

export class UserModule {}
