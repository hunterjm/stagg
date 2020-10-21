import * as JWT from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { Connection, Types } from 'mongoose'
import { InjectConnection } from '@nestjs/mongoose'
import { Injectable } from '@nestjs/common'
import { User, UserDAO } from 'src/user/entity'
import { Account, AccountDAO } from 'src/callofduty/account/entity'
import { JWT_SECRET } from 'src/config'

@Injectable()
export class UserService {
  constructor(
    private readonly userDao: UserDAO,
    private readonly codAcctDao: AccountDAO,
    @InjectConnection('stagg') private db_stg: Connection,
  ) {}
  public async generateJwt(user:User):Promise<string> {
    const accounts = await this.fetchDomainAccounts(user.userId)
    return JWT.sign({ user, accounts }, JWT_SECRET)
  }
  public async generateJwtById(userId:string):Promise<string> {
    try {
      const user = await this.userDao.findById(userId)
      return this.generateJwt(user)
    } catch(e) {
      console.log('Error generating jwt:', e)
    }
  }
  public async generateApiKey():Promise<string> {
    let apiKey = uuidv4()
    let found = await this.userDao.findByApiKey(apiKey)
    while(found) {
      apiKey = uuidv4()
      found = await this.userDao.findByApiKey(apiKey)
    }
    return apiKey
  }
  public async fetchDomainAccounts(userId:string): Promise<User.Schema.Domain[]> {
    const domainAccts:User.Schema.Domain[] = []
    const codAccts = await this.codAcctDao.findAllByUserId(userId)
    for(const { accountId } of codAccts) {
      domainAccts.push({ domainId: 'callofduty', accountId })
    }
    // Check Discord
    return domainAccts
  }
  public async fetchById(_id:string): Promise<any> {
    return this.db_stg.collection('users').findOne({ _id: Types.ObjectId(_id) })
  }
  public async fetchByDiscordId(discordId:string): Promise<any> {
    return this.db_stg.collection('users').findOne({ 'discord.id': discordId })
  }
  public async fetchByGameAccountId(game:'callofduty', _id:string): Promise<any> {
    return this.db_stg.collection('users').findOne({ [`accounts.${game}`]: Types.ObjectId(_id) })
  }
}
