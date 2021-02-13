import * as JWT from 'jsonwebtoken'
import { Injectable } from '@nestjs/common'
import { CallOfDutyAccountService } from 'src/callofduty/account/services'
import { DiscordService } from 'src/discord/services'
import { JWT_SECRET } from 'src/config'
import { Stagg } from '@stagg/db'
import { User } from './controller'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Stagg.User.Repository, 'stagg') 
    private readonly userRepo: Stagg.User.Repository,
    private readonly discordSvcs: DiscordService,
    private readonly codAcctSvcs: CallOfDutyAccountService,
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
      const payload = this.verifyJwt<{ user: Stagg.User.Entity }>(headers.authorization.replace('Bearer ', ''))
      return payload
    } catch(e) {
      return null
    }
  }
  public async generateJwt(user:Stagg.User.Entity):Promise<string> {
    const accounts = await this.fetchDomainAccounts(user.userId)
    return JWT.sign({ user, accounts }, JWT_SECRET)
  }
  public async generateJwtById(userId:string):Promise<string> {
    try {
      const user = await this.userRepo.findOne(userId)
      return this.generateJwt(user)
    } catch(e) {
      return null
    }
  }
  public async createUser():Promise<Stagg.User.Entity> {
    return await this.userRepo.insertUser()
  }
  public async fetchDomainAccounts(userId:string): Promise<User.Schema.Domain[]> {
    const domainAccts:User.Schema.Domain[] = []
    // Check CallOfDuty
    const codAccts = await this.codAcctSvcs.findAllByUserId(userId)
    for(const { accountId } of codAccts) {
      const model = await this.codAcctSvcs.buildModelForAccountId(accountId)
      const sanitizedModel = this.codAcctSvcs.sanitizeModel(model)
      domainAccts.push({ domainId: 'callofduty', accountId, model: sanitizedModel })
    }
    // Check Discord
    const discordAccount = await this.discordSvcs.findByUserId(userId)
    if (discordAccount) {
      domainAccts.push({ domainId: 'discord', accountId: discordAccount.discordId, model: discordAccount })
    }
    return domainAccts
  }
}
