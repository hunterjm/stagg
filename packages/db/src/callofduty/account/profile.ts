import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { Schema as CallOfDuty } from 'callofduty'
import { Account } from './account'
import { BaseEntity } from '../../base.entity'

@Entity({ name: 'accounts/profiles', database: 'callofduty' })
export class AccountProfile extends BaseEntity {
    @PrimaryColumn('text')
    hashId: string

    @ManyToOne(() => Account, { nullable: false })
    @JoinColumn({ name: 'accountId' })
    account: Account

    @Column('citext')
    platform: string

    @Column('citext')
    username: string

    @Column('citext', { array: true })
    games: CallOfDuty.Game[]

    @DeleteDateColumn()
    deleted: Date
}