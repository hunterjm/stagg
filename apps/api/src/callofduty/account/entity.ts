import { Schema } from '@stagg/callofduty'
import { Entity, Column, PrimaryColumn, Index, TableInheritance } from 'typeorm'

export type Access = 'public' | 'protected' | 'private'

export interface ProfileIdentifier {
  username: string
  platform: Schema.API.Platform
}

export interface AuthTokens {
  sso: string
  xsrf: string
  atkn: string
}

@Entity({ name: 'accounts' })
export class Account {
  @PrimaryColumn()
  @Index({ unique: true })
  unoId: string

  @Column()
  access: Access

  @Column('jsonb', { array: true })
  auth: AuthTokens[]

  @Column()
  created: number
}

@Entity({ name: 'accounts/lookup' })
export class AccountLookup {
  @PrimaryColumn()
  @Index({ unique: true })
  unoId: string

  @Column('text', { array: true })
  emails: string[]

  @Column('text', { array: true })
  games: Schema.API.Game[]

  @Column('jsonb', { array: true })
  profiles: ProfileIdentifier[]
}
