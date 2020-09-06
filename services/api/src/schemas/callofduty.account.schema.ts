import { Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'


@Schema()
export class Account extends Document {
  @Prop({ required: true })
  origin: 'self' | 'kgp' | 'friend' | 'enemy' | 'random'

  @Prop()
  auth: Auth

  @Prop()
  email?: string

  @Prop()
  profiles?: {
      id?: string
      uno?: string
      xbl?: string
      psn?: string
      steam?: string
      battle?: string
  }

  @Prop()
  scrape?: {
    updated?: number
    rechecked?: number
    initialized?: number
    bo4?: ScrapedGame
    mw?: ScrapedGame
  }

  @Prop()
  prev?: {
      auth?: Auth[]
      email?: string[]
  }

  @Prop()
  initFailure?: boolean
}

class Auth {
    sso: string
    xsrf: string
    atkn: string
}

class ScrapedGame {
    mp: ScrapedMode
    wz: ScrapedMode
}
class ScrapedMode {
    updated: number
    failures: number
    timestamp: number
}

export const AccountSchema = SchemaFactory.createForClass(Account)
