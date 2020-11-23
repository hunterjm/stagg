import { Column, Entity, Index, PrimaryColumn } from 'typeorm'
import { Schema as CallOfDuty } from 'callofduty'
import { BaseEntity } from '../../../../base.entity'

@Entity({ name: 'mw/mp/match/details', database: 'callofduty' })
export class Detail extends BaseEntity {
    @PrimaryColumn('text')
    matchId: string

    @Column('citext')
    modeId: CallOfDuty.MW.Mode.MP

    @Column('citext')
    mapId: CallOfDuty.MW.Map.MP

    @Column('integer')
    startTime: number

    @Column('integer')
    endTime: number
}