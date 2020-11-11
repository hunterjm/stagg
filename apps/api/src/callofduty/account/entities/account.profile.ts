import { Schema as CallOfDuty, Schema } from 'callofduty'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Entity, Column, PrimaryColumn } from 'typeorm'

export type AuthTokens = { sso: string, xsrf: string, atkn: string }
export type ProfileId = { username: string, platform: CallOfDuty.Platform }

@Entity({ name: 'accounts/profiles', database: 'callofduty' })
export class AccountProfile {
  @PrimaryColumn('uuid', { unique: true })
  profileId: string

  @Column('uuid', { nullable: true })
  accountId: string

  @Column('citext')
  platform: string

  @Column('citext')
  username: string

  @Column('citext', { array: true })
  games: CallOfDuty.Game[]

  @Column('timestamp without time zone')
  created: number

  @Column('timestamp without time zone', { nullable: true })
  deleted: number
}

@Injectable()
export class AccountProfileDAO {
  constructor(
    @InjectRepository(AccountProfile, 'callofduty') private repo: Repository<AccountProfile>,
  ) {}
  private normalizeModel(model:Partial<AccountProfile>) {
    return {
      ...model,
      games: () => `array[${[...new Set(model.games)].map(game => `'${game}'`).join(',')}]::citext[]`,
    }
  }
  public async findById(profileId:string):Promise<AccountProfile> {
    return this.repo.findOne({ where: { profileId } })
  }
  public async deleteById(profileId:string) {
    await this.repo.delete(profileId)
  }
  public async findByUsername(username:string, platform:Schema.Platform):Promise<AccountProfile> {
    return this.repo.findOne({ where: { username, platform }, order: { created: -1 } })
  }
  public async findAllByAccountId(accountId:string):Promise<AccountProfile[]> {
    return this.repo.find({ where: { accountId } })
  }
  public async insert(model:Partial<AccountProfile>):Promise<string> {
    await this.repo.createQueryBuilder()
      .insert()
      .into(AccountProfile)
      .values(this.normalizeModel(model))
      .execute()
    const { username, platform, accountId } = model
    const { profileId } = await this.repo.findOne({ where: { username, platform, accountId }, order: { created: -1 } })
    return profileId
  }
}
