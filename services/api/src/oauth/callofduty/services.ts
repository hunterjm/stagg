import * as mdb from '@stagg/mdb'
import * as API from '@stagg/api'
import { Injectable } from '@nestjs/common'
import { MONGO } from '../../config'

mdb.config({ host: MONGO.HOST, user: MONGO.USER, password: MONGO.PASS })

@Injectable()
export class CallOfDutyOAuthService {
  async AccountByEmail(email:string): Promise<mdb.Schema.CallOfDuty.Account> {
    const db = await mdb.client('callofduty')
    const account = await db.collection('accounts').findOne({ email })
    return account
  }
  async InsertAccount(account:mdb.Schema.CallOfDuty.Account): Promise<void> {
    
  }
  async UpdateAccount(account:mdb.Schema.CallOfDuty.Account, auth:mdb.Schema.CallOfDuty.Account.Auth): Promise<void> {
    const prevAuth = account.prev?.auth ? account.prev.auth : []
    // if (account.auth) prevAuth.push(account.auth)
    // await mongo.collection('accounts').updateOne({ _id: userRecord._id }, { $set: { auth, 'prev.auth': prevAuth } })
    // const { discord, profiles, uno } = userRecord
    // const jwt = JWT.sign({ email, discord, profiles, uno }, cfg.jwt)
    // return res.status(200).send({ jwt })
  }
  async SignIn(email:string, password:string): Promise<void> {
    const CallOfDutyAPI = new API.CallOfDuty()
    try {
      const tokens = await CallOfDutyAPI.Login(email, password)
      const account = await this.AccountByEmail(email)
      if (account) {
        await this.UpdateAccount(account, tokens)
      } else {
        await this.InsertAccount(account)
      }
    } catch(e) {
      // Login failed for reason "e"
    }
  }
}
