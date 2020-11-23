import { Column, Entity, PrimaryColumn } from 'typeorm'
import { Schema as CallOfDuty } from 'callofduty'
import { BaseEntity } from '../../../../base.entity'

@Entity({ name: 'mw/wz/match/details', database: 'callofduty' })
export class Detail extends BaseEntity {
    @PrimaryColumn('text')
    matchId: string

    @Column('citext')
    modeId: CallOfDuty.MW.Mode.WZ

    @Column('citext')
    mapId: CallOfDuty.MW.Map.WZ

    @Column('integer')
    startTime: number

    @Column('integer')
    endTime: number
}