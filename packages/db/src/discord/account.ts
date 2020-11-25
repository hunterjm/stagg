import { AbstractRepository, Column, Entity, EntityRepository, PrimaryColumn } from 'typeorm'
import { BaseEntity } from '../abstract'

@Entity({ name: 'accounts', database: 'discord' })
export class Account extends BaseEntity {
    @PrimaryColumn('text')
    discordId: string

    @Column('uuid', { unique: true })
    userId: string

    @Column('citext')
    tag: string

    @Column('citext')
    avatar: string
}

@EntityRepository(Account)
export class AccountRepository extends AbstractRepository<Account> {
    private normailze({ discordId, userId, tag, avatar }: Partial<Account>) {
        return { discordId, userId, tag, avatar }
    }

    public async insertAccount(account: Partial<Account>): Promise<Account> {
        return await this.repository.save(this.normailze(account))
    }

    public async updateAccount(account: Account): Promise<Account> {
        const existing = await this.repository.findOneOrFail(account.discordId)
        return await this.repository.save({ ...existing, ...this.normailze(account) })
    }

    public async updateAccountByUserId(account: Account): Promise<Account> {
        const existing = await this.repository.findOneOrFail({ where: { userId: account.userId }})
        return await this.repository.save({ ...existing, ...this.normailze(account)})
    }
}