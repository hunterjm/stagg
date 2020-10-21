import axios from 'axios'
import * as JWT from 'jsonwebtoken'
import { Injectable } from '@nestjs/common'
import { Account } from 'src/callofduty/account/entity'
import { JWT_SECRET, FAAS } from 'src/config'

@Injectable()
export class CallOfDutyEtlService {
  constructor() {}
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
