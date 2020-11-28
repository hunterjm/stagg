import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { InsertResult, Repository, UpdateResult } from 'typeorm'
import { Entity, Column, PrimaryColumn, Index } from 'typeorm'
import { Postgres } from 'src/util'

@Entity({ name: 'users', database: 'stagg' })
export class User {
  @PrimaryColumn('uuid')
  @Index({ unique: true })
  userId: string

  @Column('uuid', { unique: true })
  apiKey: string

  @Column()
  createdAt: Date

  @Column()
  updatedAt: Date
}

@Injectable()
export class UserDAO {
  constructor(
    @InjectRepository(User, 'stagg') private userRepo: Repository<User>,
  ) {}
  private normalizeModel({ apiKey }:Partial<User>) {
    return { apiKey }
  }
  public async insert(user:Partial<User>):Promise<InsertResult> {
    return this.userRepo.createQueryBuilder()
      .insert()
      .into(User)
      .values(this.normalizeModel(user))
      .execute()
  }
  public async update(user:User):Promise<UpdateResult> {
    return this.userRepo.createQueryBuilder()
      .update()
      .set(this.normalizeModel(user))
      .where({ id: user.userId })
      .execute()
  }
  public async findById(userId:string):Promise<User> {
      const acct = await this.userRepo.findOne(userId)
      if (!acct) {
          return null
      }
      return Postgres.Denormalize.Model<User>(acct)
  }
  public async findByApiKey(apiKey:string):Promise<User> {
      const acct = await this.userRepo.findOne({ where: { apiKey } })
      if (!acct) {
          return null
      }
      return Postgres.Denormalize.Model<User>(acct)
  }
}
export namespace User {
  export namespace Schema {
    export type DomainId = 'discord' | 'callofduty' | 'pubg'
    export type Domain = { domainId: DomainId, accountId: string, model?:any }
  }
}
