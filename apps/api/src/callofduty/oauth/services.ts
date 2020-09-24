import * as mdb from '@stagg/mdb'
import * as JWT from 'jsonwebtoken'
import { Connection } from 'mongoose'
import { InjectConnection } from '@nestjs/mongoose'
import { Injectable } from '@nestjs/common'
import { JWT_SECRET } from '../../config'


@Injectable()
export class CallOfDutyOAuthService {
  constructor(
    @InjectConnection('stagg') private db_stg: Connection,
    @InjectConnection('callofduty') private db_cod: Connection,
  ) {}
  public async accountByEmail(email:string): Promise<mdb.Schema.CallOfDuty.Account> {
    const account = await this.db_cod.collection('accounts').findOne({ email })
    return account
  }
  public async insertAccount(email:string, auth:mdb.Schema.CallOfDuty.Account.Auth): Promise<mdb.Schema.CallOfDuty.Account> {
    await this.db_cod.collection('accounts').insertOne({
      origin: 'self',
      email,
      auth,
    })
    const account = await this.db_cod.collection('accounts').findOne({ email })
    await this.db_stg.collection('users').insertOne({ emails: [email], accounts: { callofduty: account._id } })
    return account
  }
  public async updateAccount(account:mdb.Schema.CallOfDuty.Account, auth:mdb.Schema.CallOfDuty.Account.Auth): Promise<void> {
    const prevAuth = account.prev?.auth ? account.prev.auth : []
    if (account.auth) {
      prevAuth.push(account.auth)
    }
    await this.db_cod.collection('accounts').updateOne({ _id: account._id }, { $set: { auth, 'prev.auth': prevAuth } })
  }
  public async accountJwt(account:mdb.Schema.CallOfDuty.Account): Promise<string> {
    const user = await this.db_stg.collection('users').findOne({ 'accounts.callofduty': account._id })
    return JWT.sign({
      id: user._id,
      discord: user.discord,
      email: account.email,
      callofduty: {
        id: account._id,
        profiles: account.profiles,
      }
    }, JWT_SECRET)
  }
}
