import { Snowflake } from 'discord.js'
import { Document, Types } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema()
export class User extends Document {
  @Prop({ required: true })
  _id: Types.ObjectId

  @Prop()
  accounts: {
      callofduty?: Types.ObjectId
  }

  @Prop()
  discord: {
    id: Snowflake
    shortcuts?: {
        [key:string]: string
    }
  }
}

export const UserSchema = SchemaFactory.createForClass(User)
