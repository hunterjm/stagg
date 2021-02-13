import {
    Entity,
    Column,
    EntityRepository,
    PrimaryGeneratedColumn
} from 'typeorm'
import { Game, Tokens } from '@callofduty/types'
import { BaseEntity, BaseRepository } from '../../abstract'
import { arrayTransformer } from '../../util'

export * as Payment from './payments'

@Entity({ name: 'accounts', database: 'stagg' })
class Account extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    account_id: string

    @Column('citext', { unique: true })
    discord_id: string

    @Column('citext')
    discord_tag: string

    @Column('citext', { nullable: true })
    discord_avatar?: string

    @Column('citext', { array: true, transformer: arrayTransformer })
    callofduty_games: Game[]

    @Column('citext', { nullable: true, unique: true })
    callofduty_uno_id: string

    @Column('citext', { nullable: true, unique: true })
    callofduty_uno_username: string

    @Column('citext', { nullable: true, unique: true })
    callofduty_xbl_username: string

    @Column('citext', { nullable: true, unique: true })
    callofduty_psn_username: string

    @Column('citext', { nullable: true, unique: true })
    callofduty_battle_username: string

    @Column('citext', { nullable: true })
    callofduty_clan_tag?: string

    @Column('jsonb')
    callofduty_authorization_tokens: Tokens

    @Column('timestamp', { nullable: true })
    subscription_expiration_datetime?: Date
}

@EntityRepository(Account)
class AccountRepository extends BaseRepository<Account> {
    protected normailze(entity:Partial<Account>) {
        return { ...entity }
    }
}

export {
    Account as Entity,
    AccountRepository as Repository
}
