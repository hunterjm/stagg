import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { InsertResult, Repository, UpdateResult } from 'typeorm'
import { Entity, Column, PrimaryColumn, Index } from 'typeorm'

@Entity({ name: 'accounts', database: 'discord' })
export class Account {
  @PrimaryColumn('text')
  @Index({ unique: true })
  discordId: string

  @Column('text')
  userId: string

  @Column('citext')
  tag: string

  @Column('citext')
  avatar: string

  @Column()
  created: number
}

@Injectable()
export class AccountDAO {
  constructor(
    @InjectRepository(Account, 'discord') private acctRepo: Repository<Account>,
  ) {}
  public async findById(discordId:string):Promise<Account> {
    return this.acctRepo.findOne({ where: { discordId } })
  }
  public async findByUserId(userId:string):Promise<Account> {
    return this.acctRepo.findOne({ where: { userId } })
  }
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
      .where({ discordId: acct.discordId })
      .execute()
  }
}
export namespace Account {
  export namespace Schema {

  }
}
