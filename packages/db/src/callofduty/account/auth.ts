import { AbstractRepository, Column, Entity, EntityRepository, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Schema as CallOfDuty } from 'callofduty'
import { Account } from './account'
import { BaseEntity } from '../../abstract'

@Entity({ name: 'accounts/auth', database: 'callofduty' })
export class AccountAuth extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    authId: string

    @ManyToOne(() => Account, { nullable: true })
    @JoinColumn({ name: 'accountId' })
    account: Account

    @Column('citext')
    ip: string

    @Column('citext')
    email: string

    @Column('citext', { array: true })
    games: CallOfDuty.Game[]

    @Column('jsonb')
    profiles: CallOfDuty.ProfileId.PlatformId[]

    @Column('jsonb')
    tokens: CallOfDuty.Tokens
}

@EntityRepository(AccountAuth)
export class AuthRepository extends AbstractRepository<AccountAuth> {
    private normalize({ account, ip, email, games, profiles, tokens }: Partial<AccountAuth>): Partial<AccountAuth> {
        const indexedProfiles: { [key: string]: CallOfDuty.ProfileId.PlatformId } = {}
        for (const { platform, username } of profiles) {
            indexedProfiles[`${platform}/${username}`] = { platform, username }
        }
        return { account, ip, email, games, profiles: Object.values(indexedProfiles), tokens }
    }

    public async insertAuth(auth: Partial<AccountAuth>): Promise<AccountAuth> {
        return await this.repository.save(this.normalize(auth))
    }

    public async updateAuth(auth: AccountAuth): Promise<AccountAuth> {
        const existing = await this.repository.findOneOrFail(auth.authId)
        return await this.repository.save({ ...existing, ...this.normalize(auth) })
    }
}