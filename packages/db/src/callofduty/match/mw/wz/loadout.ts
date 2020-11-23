import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { Account } from '../../../account'
import { Detail } from './detail'
import { Schema as CallOfDuty } from 'callofduty'
import { BaseEntity } from '../../../../base.entity'

@Entity({ name: 'mw/wz/match/loadouts', database: 'callofduty' })
@Index('idx_mwwz_loadout_matchaccount', ['match', 'account'])
export class Loadout extends BaseEntity {
    @PrimaryColumn('text')
    hashId: string // objHash(loadout)

    @ManyToOne(() => Detail)
    @JoinColumn({ name: 'matchId' })
    match: Detail

    @ManyToOne(() => Account)
    @JoinColumn({ name: 'accountId' })
    account: Account

    @Column('citext', { nullable: true })
    pwId: CallOfDuty.MW.Weapon.Name

    @Column('smallint', { nullable: true })
    pwVariant: number

    @Column('citext', { array: true, nullable: true })
    pwAttachments: string[]

    @Column('citext', { nullable: true })
    swId: CallOfDuty.MW.Weapon.Name

    @Column('smallint', { nullable: true })
    swVariant: number

    @Column('citext', { array: true, nullable: true })
    swAttachments: string[]

    @Column('citext', { nullable: true })
    lethal: string

    @Column('citext', { nullable: true })
    tactical: string

    @Column('citext', { array: true, nullable: true })
    perks: string[]
}