import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { InsertResult, Repository, UpdateResult } from 'typeorm'
import { Entity, Column, PrimaryColumn } from 'typeorm'
import { Postgres } from 'src/util'

@Entity({ name: 'accounts', database: 'callofduty' })
export class Account {
  @PrimaryColumn('uuid', { unique: true })
  accountId: string
  
  @Column('uuid', { nullable: true })
  userId: string
  
  @Column('text', { nullable: true })
  unoId: string

  @Column()
  createdAt: Date

  @Column()
  updatedAt: Date
}

@Injectable()
export class AccountDAO {
  constructor(
    @InjectRepository(Account, 'callofduty') private acctRepo: Repository<Account>,
  ) {}
  public async insert(acct:Partial<Account>):Promise<InsertResult> {
    return this.acctRepo.createQueryBuilder()
      .insert()
      .into(Account)
      .values(acct)
      .execute()
  }
  public async update(acct:Account):Promise<UpdateResult> {
    return this.acctRepo.createQueryBuilder()
      .update()
      .set(acct)
      .where({ accountId: acct.accountId })
      .execute()
  }
  public async findAll():Promise<Account[]> {
      const accts = await this.acctRepo.find()
      for(const i in accts) {
        accts[i] = Postgres.Denormalize.Model<Account>(accts[i])
      }
      return accts
  }
  public async findById(accountId:string):Promise<Account> {
      const acct = await this.acctRepo.findOne(accountId)
      if (!acct) {
        return null
      }
      return Postgres.Denormalize.Model<Account>(acct)
  }
  public async findAllByUserId(userId:string):Promise<Account[]> {
      const accts = await this.acctRepo.find({ where: { userId } })
      if (!accts || !accts.length) {
        return []
      }
      return accts.map(acct => Postgres.Denormalize.Model<Account>(acct))
  }
  public async findByUnoId(unoId:string):Promise<Account> {
      const acct = await this.acctRepo.findOne({ where: { unoId } })
      if (!acct) {
        return null
      }
      return Postgres.Denormalize.Model<Account>(acct)
  }
}
