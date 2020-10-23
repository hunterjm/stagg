
import * as randomStr from 'randomstring'
import * as gmailSend from 'gmail-send'
import { Injectable } from '@nestjs/common'
import { GMAIL } from 'src/config'
import templateConfirmDiscordCode from './templates/confirm.discord.code'
import { Connection, Types } from 'mongoose'
import { InjectConnection } from '@nestjs/mongoose'

@Injectable()
export class MailService {
  constructor(
    @InjectConnection('stagg') private db_stg: Connection,
  ) {}
  private sendEmail(to:string, subject:string, html:string):Promise<any> {
    const user = GMAIL.USER
    const pass = GMAIL.PASS
    console.log('[>] Dispatching email:')
    console.log('    From:', user)
    console.log('    Subject:', subject)
    console.log('    To:', to)
    return new Promise((resolve,reject) => 
      gmailSend({ to, subject, user, pass })
        ({ html }, (error, result, fullResult) => error ? reject(error) : resolve({ result, fullResult }))
    )
  }
  public randomCode():string {
    return randomStr.generate(5).toUpperCase()
  }
  public async sendDiscordCode(email:string, discordId:string, code:string=this.randomCode()) {
    const html = templateConfirmDiscordCode(code)
    return this.sendEmail(email, 'Confirm your Discord account', html)
  }
}
