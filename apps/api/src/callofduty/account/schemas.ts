import { Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as CallOfDuty from '@stagg/callofduty'

@Schema()
export class Account extends Document {
  @Prop({ required: true })
  origin: 'self' | 'kgp' | 'friend' | 'enemy' | 'random'

  @Prop()
  auth: {
    sso: string
    xsrf: string
    atkn: string
  }

  @Prop()
  email?: string

  @Prop()
  games?: CallOfDuty.Schema.API.Game[]

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
    bo4?: {
        mw: {
            updated: number
            failures: number
            timestamp: number
        }
        wz: {
            updated: number
            failures: number
            timestamp: number
        }
    }
    mw?: {
        mw: {
            updated: number
            failures: number
            timestamp: number
        }
        wz: {
            updated: number
            failures: number
            timestamp: number
        }
    }
  }

  @Prop()
  prev?: {
      auth?: {
        sso: string
        xsrf: string
        atkn: string
      }[]
      email?: string[]
  }

  @Prop()
  initFailure?: boolean
}

export const AccountSchema = SchemaFactory.createForClass(Account)
