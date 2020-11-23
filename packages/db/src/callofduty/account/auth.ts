import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Schema as CallOfDuty } from 'callofduty'
import { Account } from './account'
import { BaseEntity } from '../../base.entity'

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

    @Column('jsonb', { array: true })
    profiles: CallOfDuty.ProfileId.PlatformId[]

    @Column('jsonb')
    tokens: CallOfDuty.Tokens
}