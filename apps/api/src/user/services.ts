import * as JWT from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { Injectable } from '@nestjs/common'
import { User, UserDAO } from 'src/user/entity'
import { AccountDAO } from 'src/callofduty/account/entity'
import { JWT_SECRET } from 'src/config'

@Injectable()
export class UserService {
  constructor(
    private readonly userDao: UserDAO,
    private readonly codAcctDao: AccountDAO,
  ) {}
  public verifyJwt<T>(jwt:string) {
    const payload:any = JWT.verify(jwt, JWT_SECRET)
    return payload as T
  }
  public getJwtPayload(headers:any) {
    if (!headers?.authorization) {
      return null
    }
    try {
      const payload = this.verifyJwt<{ user: User }>(headers.authorization.replace('Bearer ', ''))
      return payload
    } catch(e) {
      return null
    }
  }
  public async generateJwt(user:User):Promise<string> {
    const accounts = await this.fetchDomainAccounts(user.userId)
    return JWT.sign({ user, accounts }, JWT_SECRET)
  }
  public async generateJwtById(userId:string):Promise<string> {
    try {
      const user = await this.userDao.findById(userId)
      return this.generateJwt(user)
    } catch(e) {
      return null
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
  public async createUser():Promise<User> {
    const apiKey = await this.generateApiKey()
    await this.userDao.insert({ apiKey })
    return this.userDao.findByApiKey(apiKey)
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
}
