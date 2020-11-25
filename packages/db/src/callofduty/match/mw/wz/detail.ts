import { AbstractRepository, Column, Entity, EntityRepository, PrimaryColumn } from 'typeorm'
import { Schema as CallOfDuty } from 'callofduty'
import { BaseEntity } from '../../../../abstract'

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

@EntityRepository(Detail)
export class DetailRepository extends AbstractRepository<Detail> {
    private normalize({ matchId, modeId, mapId, startTime, endTime }: Partial<Detail>): Partial<Detail> {
        return { matchId, modeId, mapId, startTime, endTime }
    }

    public async insertDetail(detail: Partial<Detail>): Promise<Detail> {
        return await this.repository.save(this.normalize(detail))
    }

    public async updateDetail(detail: Detail): Promise<Detail> {
        const existing = await this.repository.findOneOrFail(detail.matchId)
        return await this.repository.save({ ...existing, ...this.normalize(detail) })
    }
}