import * as mdb from '@stagg/mdb'
import * as API from '@stagg/api'
import * as JWT from 'jsonwebtoken'
import { Connection } from 'mongoose'
import { InjectConnection } from '@nestjs/mongoose'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JWT_SECRET } from '../../config'


@Injectable()
export class CallOfDutyDataService {
  constructor(
    @InjectConnection('stagg') private db_stg: Connection,
    @InjectConnection('callofduty') private db_cod: Connection,
  ) {}
  async MatchIds() {
    return (await this.db_cod.collection('mw.mp.performances').find({}, { matchId: 1 } as any).limit(1500).toArray()).map(p => p.matchId)
  }
  async Account(platform:string, identifier:string): Promise<mdb.Schema.CallOfDuty.Account> {
    return {} as any
  }
  async PipePerformances() {
    

  }
}