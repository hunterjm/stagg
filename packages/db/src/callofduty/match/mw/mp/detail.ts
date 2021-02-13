import { AbstractRepository, Column, Entity, EntityRepository, Index, PrimaryColumn } from 'typeorm'
import { Schema as CallOfDuty } from 'callofduty'
import { BaseEntity } from '../../../../abstract'

@Entity({ name: 'mw/mp/match/details', database: 'callofduty' })
class Detail extends BaseEntity {
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

@EntityRepository(Detail)
class DetailRepository extends AbstractRepository<Detail> {
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

export {
    Detail as Entity,
    DetailRepository as Repository
}