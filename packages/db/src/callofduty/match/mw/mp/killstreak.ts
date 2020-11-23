import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { Detail } from './detail'
import { Account } from '../../../account'
import { Schema as CallOfDuty } from 'callofduty'
import { BaseEntity } from '../../../../base.entity'

@Entity({ name: 'mw/mp/match/killstreaks', database: 'callofduty' })
@Index('idx_mwmp_killstreak_matchaccount', ['match', 'account'])
export class Killstreak extends BaseEntity {
    @PrimaryColumn('text')
    combinedId: string // <matchId>.<accountId>.<killstreakId>

    @ManyToOne(() => Detail, { nullable: false })
    @JoinColumn({ name: 'matchId' })
    match: Detail
    
    @ManyToOne(() => Account, { nullable: false })
    @JoinColumn({ name: 'accountId' })
    account: Account

    @Column('citext')
    killstreakId: CallOfDuty.MW.Killstreak

    @Column('smallint')
    uses: number

    @Column('smallint')
    kills: number

    @Column('smallint')
    takedowns: number
}