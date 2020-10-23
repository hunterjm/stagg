import { Schema } from '@stagg/callofduty'
import { Connection } from 'mongoose'
import { InjectConnection } from '@nestjs/mongoose'
import { Injectable } from '@nestjs/common'
import { Account, AccountDAO } from 'src/callofduty/account/entity'
import { User, UserDAO } from 'src/user/entity'
import { UserService } from 'src/user/services'


@Injectable()
export class CallOfDutyOAuthService {
  constructor(
    private readonly userDAO: UserDAO,
    private readonly acctDao: AccountDAO,
    private readonly userService: UserService,
    @InjectConnection('stagg') private db_stg: Connection,
    @InjectConnection('callofduty') private db_cod: Connection,
  ) {}

  public async createNewAccount(
    email:string,
    games:Schema.API.Game[],
    profiles:Account.Schema.ProfileId[],
    authTokens:Account.Schema.AuthTokens
  ):Promise<{ user: User, account: Account }> {
    const apiKey = await this.userService.generateApiKey()
    await this.userDAO.insert({ apiKey })
    const newUser = await this.userDAO.findByApiKey(apiKey)
    await this.acctDao.insert({ userId: newUser.userId, games, profiles, emails: [email], auth: [authTokens] })
    const newAcct = await this.acctDao.findByEmail(email)
    return { user: newUser, account: newAcct }
  }

  public async migrateMongoAccounts() {
    const allAccounts = await this.db_cod.collection('accounts').find().toArray()
    for(const mongoAcct of allAccounts) {
      if (!mongoAcct.email || !mongoAcct.auth) {
        continue
      }
      const normalizedProfiles = []
      for(const platform of Object.keys(mongoAcct.profiles)) {
        const username = mongoAcct.profiles[platform]
        normalizedProfiles.push({ platform, username })
      }
      const { user, account } = await this.createNewAccount(mongoAcct.email, mongoAcct.games, normalizedProfiles, mongoAcct.auth)
      const mongoUser = await this.db_stg.collection('users').findOne({ 'accounts.callofduty': mongoAcct._id })
    }
  }

}
