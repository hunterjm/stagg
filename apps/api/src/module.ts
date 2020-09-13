import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { OAuthModule } from './oauth/module'
import { DataModule } from './data/module'
import { CallOfDutyModule } from './callofduty/module'
import { MONGO } from './config'

@Module({
  imports: [
    DataModule,
    OAuthModule,
    CallOfDutyModule,
    MongooseModule.forRoot(
      MONGO.CONNECTION_STR('stagg'),
      { connectionName: 'stagg' }
    ),
    MongooseModule.forRoot(
      MONGO.CONNECTION_STR('callofduty'),
      { connectionName: 'callofduty' }
    )
  ],
})
export class RootModule {}
