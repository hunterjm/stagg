import * as API from '@stagg/api'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OAuthService {
  CallOfDuty: OAuthCallOfDutyService
}

class OAuthCallOfDutyService {
  async SignIn(email:string, password:string): Promise<void> {
    const CallOfDutyAPI = new API.CallOfDuty()
    try {
      const tokens = await CallOfDutyAPI.Login(email, password)
    } catch(e) {
      // Login failed for reason "e"
    }
  }
}
