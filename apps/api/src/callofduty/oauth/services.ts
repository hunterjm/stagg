import { Connection } from 'mongoose'
import { InjectConnection } from '@nestjs/mongoose'
import { Injectable } from '@nestjs/common'
import { AccountDAO } from '../account/entity'


@Injectable()
export class CallOfDutyOAuthService {
  constructor(
    private readonly acctDao: AccountDAO,
    @InjectConnection('stagg') private db_stg: Connection,
    @InjectConnection('callofduty') private db_cod: Connection,
  ) {}

}
