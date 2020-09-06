import * as mdb from '@stagg/mdb'
import * as API from '@stagg/api'
import * as JWT from 'jsonwebtoken'
import { Connection } from 'mongoose'
import { InjectConnection } from '@nestjs/mongoose'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JWT_SECRET } from '../../config'


@Injectable()
export class CallOfDutyOAuthService {
  constructor(
    @InjectConnection('stagg') private db_stg: Connection,
    @InjectConnection('callofduty') private db_cod: Connection,
  ) {}
  private async AccountByEmail(email:string): Promise<mdb.Schema.CallOfDuty.Account> {
    const account = await this.db_cod.collection('accounts').findOne({ email })
    return account
  }
  private async InsertAccount(email:string, auth:mdb.Schema.CallOfDuty.Account.Auth): Promise<mdb.Schema.CallOfDuty.Account> {
    await this.db_cod.collection('accounts').insertOne({
      origin: 'self',
      email,
      auth,
    })
    const account = await this.db_cod.collection('accounts').findOne({ email })
    await this.db_stg.collection('users').insertOne({ accounts: { callofduty: account._id } })
    return account
  }
  private async UpdateAccount(account:mdb.Schema.CallOfDuty.Account, auth:mdb.Schema.CallOfDuty.Account.Auth): Promise<void> {
    const prevAuth = account.prev?.auth ? account.prev.auth : []
    if (account.auth) {
      prevAuth.push(account.auth)
    }
    await this.db_cod.collection('accounts').updateOne({ _id: account._id }, { $set: { auth, 'prev.auth': prevAuth } })
  }
  private async AccountJWT(account:mdb.Schema.CallOfDuty.Account): Promise<string> {
    const user = await this.db_stg.collection('users').findOne({ 'accounts.callofduty': account._id })
    return JWT.sign({
      email: account.email,
      profiles: account.profiles,
      discord: user.discord,
      scrape: account.scrape,
    }, JWT_SECRET)
  }
  async SignIn(email:string, password:string): Promise<string> {
    const CallOfDutyAPI = new API.CallOfDuty()
    try {
      const tokens = await CallOfDutyAPI.Login(email, password)
      let account = await this.AccountByEmail(email)
      if (account) {
        await this.UpdateAccount(account, tokens)
      } else {
        account = await this.InsertAccount(email, tokens)
      }
      return await this.AccountJWT(account)
    } catch(e) {
      throw new UnauthorizedException(e)
    }
  }
}
