import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { Account } from '../../../account'
import { Detail } from './detail'
import { Schema as CallOfDuty } from 'callofduty'
import { BaseEntity } from '../../../../base.entity'

@Entity({ name: 'mw/mp/match/weapons', database: 'callofduty' })
@Index('idx_mwmp_weapon_matchaccount', ['match', 'account'])
export class Weapon extends BaseEntity {
    @PrimaryColumn('text')
    combinedId: string // <matchId>.<accountId>.<weaponId>
    
    @ManyToOne(() => Detail, { nullable: false })
    @JoinColumn({ name: 'matchId' })
    match: Detail

    @ManyToOne(() => Account, { nullable: false })
    @JoinColumn({ name: 'accountId' })
    account: Account

    @Column('citext')
    weaponId: CallOfDuty.MW.Weapon.Name

    @Column('smallint')
    loadoutIndex: number

    @Column('smallint')
    kills: number

    @Column('smallint')
    deaths: number

    @Column('smallint')
    headshots: number

    @Column('smallint')
    shotsHit: number

    @Column('smallint')
    shotsMiss: number

    @Column('integer')
    xpStart: number

    @Column('integer')
    xpEarned: number
}