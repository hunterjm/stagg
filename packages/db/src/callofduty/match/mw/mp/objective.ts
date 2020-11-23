import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { Account } from '../../../account'
import { Detail } from './detail'
import { BaseEntity } from '../../../../base.entity'

@Entity({ name: 'mw/mp/match/objectives', database: 'callofduty' })
@Index('idx_mwmp_objective_matchaccount', ['match', 'account'])
export class Objective extends BaseEntity {
    @PrimaryColumn('text')
    combinedId: string // <matchId>.<accountId>.<objectiveId>

    @ManyToOne(() => Detail, { nullable: false })
    @JoinColumn({ name: 'matchId' })
    match: Detail

    @ManyToOne(() => Account, { nullable: false })
    @JoinColumn({ name: 'accountId' })
    account: Account

    @Column('citext')
    objectiveId: string

    @Column('smallint')
    objectivesEarned: number
}