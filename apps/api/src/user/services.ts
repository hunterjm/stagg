import { Connection, Types } from 'mongoose'
import { InjectConnection } from '@nestjs/mongoose'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UserService {
  constructor(
    @InjectConnection('stagg') private db_stg: Connection,
  ) {}
  public async fetchById(_id:string): Promise<any> {
    return this.db_stg.collection('users').findOne({ _id: Types.ObjectId(_id) })
  }
  public async fetchByGameAccountId(game:'callofduty', _id:string): Promise<any> {
    return this.db_stg.collection('users').findOne({ [`accounts.${game}`]: Types.ObjectId(_id) })
  }
}
