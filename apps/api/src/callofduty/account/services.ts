import axios from 'axios'
import * as JWT from 'jsonwebtoken'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { Account, AccountDAO, AccountAuthDAO } from './entity'
import { JWT_SECRET, FAAS } from 'src/config'

@Injectable()
export class CallOfDutyAccountService {
  constructor(
    private readonly acctDao: AccountDAO,
    private readonly authDao: AccountAuthDAO,
  ) {}
  public async createAccount(userId:string, authId:string, etl:boolean=true):Promise<Account> {
    const authRecord = await this.authDao.findById(authId)
    if (!authRecord) {
      throw new InternalServerErrorException('invalid authId')
    }
    const { games, profiles, email, auth } = authRecord
    await this.acctDao.insert({ userId, games, profiles, emails: [email], auth: [auth] })
    const newAccount = await this.acctDao.findByEmail(email)
    if (etl) {
      this.triggerETL(newAccount)
    }
    return newAccount
  }
  public triggerETL(account:Account) {
    const authTokens = account.auth[account.auth.length-1]
    const integrityJwt = JWT.sign({ account }, JWT_SECRET)
    const { username, platform } = account.profiles[0]
    for(const gameId of account.games) {
        if (gameId === 'bo4') {
            continue // havent normalized this yet
        }
        for(const gameType of ['mp', 'wz']) {
            const payload = {
                gameId,
                gameType,
                username,
                platform,
                authTokens,
                startTime: 0,
            }
            console.log(`[>] Kicking off ETL for ${gameId}/${gameType}/${username}/${platform}`)
            axios.post(FAAS.ETL_COD, payload, { headers: { 'x-integrity-jwt': integrityJwt } })
        }
    }
  }
}
