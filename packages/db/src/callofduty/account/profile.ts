const objHash = require('object-hash')
import { AbstractRepository, Column, DeleteDateColumn, Entity, EntityRepository, JoinColumn, ManyToOne, PrimaryColumn, UpdateResult } from 'typeorm'
import { Schema as CallOfDuty } from 'callofduty'
import { Entity as Account } from './account'
import { BaseEntity } from '../../abstract'

@Entity({ name: 'accounts/profiles', database: 'callofduty' })
class AccountProfile extends BaseEntity {
    @PrimaryColumn('text')
    hashId: string

    @ManyToOne(() => Account, { nullable: false })
    @JoinColumn({ name: 'accountId' })
    account: Account

    @Column('citext')
    platform: CallOfDuty.Platform

    @Column('citext')
    username: string

    @Column('citext', { array: true })
    games: CallOfDuty.Game[]

    @DeleteDateColumn()
    deleted: Date
}

@EntityRepository(AccountProfile)
class ProfileRepository extends AbstractRepository<AccountProfile> {
    private normailze({ hashId, account, platform, username, games, deleted }: Partial<AccountProfile>): Partial<AccountProfile> {
        if (!hashId) {
            hashId = objHash({ accountId: account.accountId, username, platform, games })
        }
        return { hashId, account, platform, username, games, deleted }
    }

    public async insertProfile(profile: Partial<AccountProfile>): Promise<AccountProfile> {
        return await this.repository.save(this.normailze(profile))
    }

    public async updateProfile(profile: AccountProfile): Promise<AccountProfile> {
        const existing = await this.repository.findOneOrFail(profile.hashId)
        return await this.repository.save({ ...existing, ...profile })
    }

    public async deleteForAccountId(accountId: string, username: string, platform: CallOfDuty.Platform): Promise<UpdateResult> {
        const existing = await this.repository.findOneOrFail({ username, platform })
        if (existing.account.accountId !== accountId) {
            throw 'invalid account'
        }
        return await this.repository.softDelete(existing.hashId)
    }
}

export {
    AccountProfile as Entity,
    ProfileRepository as Repository
}
