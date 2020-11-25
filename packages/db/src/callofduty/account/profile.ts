import { AbstractRepository, Column, DeleteDateColumn, Entity, EntityRepository, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { Schema as CallOfDuty } from 'callofduty'
import { Account } from './account'
import { BaseEntity } from '../../abstract'

@Entity({ name: 'accounts/profiles', database: 'callofduty' })
export class AccountProfile extends BaseEntity {
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
export class ProfileRepository extends AbstractRepository<AccountProfile> {
    private normailze({ hashId, account, platform, username, games, deleted }: Partial<AccountProfile>): Partial<AccountProfile> {
        return { hashId, account, platform, username, games, deleted }
    }

    public async insertProfile(profile: Partial<AccountProfile>): Promise<AccountProfile> {
        return await this.repository.save(this.normailze(profile))
    }

    public async updateProfile(profile: AccountProfile): Promise<AccountProfile> {
        const existing = await this.repository.findOneOrFail(profile.hashId)
        return await this.repository.save({ ...existing, ...profile })
    }
}