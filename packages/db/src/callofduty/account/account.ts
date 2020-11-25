import { AbstractRepository, Column, Entity, EntityRepository, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from '../../abstract'

@Entity({ name: 'accounts', database: 'callofduty' })
export class Account extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    accountId: string

    @Column('uuid', { nullable: true })
    userId: string

    @Column('text', { nullable: true, unique: true })
    unoId: string
}

@EntityRepository(Account)
export class AccountRepository extends AbstractRepository<Account> {
    private normailze({ userId, unoId }: Partial<Account>) {
        return { userId, unoId }
    }

    public async insertAccount(account: Partial<Account>): Promise<Account> {
        return await this.repository.save(this.normailze(account))
    }

    public async updateAccount(account: Account): Promise<Account> {
        const existing = await this.repository.findOneOrFail(account.accountId)
        return await this.repository.save({ ...existing, ...this.normailze(account) })
    }

    public async findAllByUserId(userId: string): Promise<Account[]> {
        const accts = await this.repository.find({ userId })
        if (!accts || !accts.length) return []
        return accts
    }
}
