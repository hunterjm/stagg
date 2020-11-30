import { AbstractRepository, Column, Entity, EntityRepository, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from '../../abstract'

@Entity({ name: 'accounts', database: 'callofduty' })
class Account extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    accountId: string

    @Column('uuid', { nullable: true })
    userId: string

    @Column('text', { nullable: true, unique: true })
    unoId: string
}

@EntityRepository(Account)
class AccountRepository extends AbstractRepository<Account> {
    private normailze({ userId, unoId }: Partial<Account>) {
        return { userId, unoId }
    }

    public async insertAccount(account: Partial<Account>): Promise<Account> {
        return this.repository.save(this.normailze(account))
    }

    public async updateAccount(account: Account): Promise<Account> {
        const existing = await this.repository.findOneOrFail(account.accountId)
        return this.repository.save({ ...existing, ...this.normailze(account) })
    }

    public async updateAccountUnoId(accountId: string, unoId: string): Promise<Account> {
        const existing = await this.repository.findOneOrFail(accountId)
        return this.repository.save({ ...existing, unoId })
    }

    public async findAll(): Promise<Account[]> {
        return this.repository.find()
    }

    public async findOneOrFail(accountId: string): Promise<Account> {
        return this.repository.findOneOrFail(accountId)
    }

    public async findOneByUnoId(unoId: string): Promise<Account> {
        return this.repository.findOne({ unoId })
    }

    public async findAllByUserId(userId: string): Promise<Account[]> {
        const accts = await this.repository.find({ userId })
        if (!accts || !accts.length) return []
        return accts
    }
}

export {
    Account as Entity,
    AccountRepository as Repository
}
