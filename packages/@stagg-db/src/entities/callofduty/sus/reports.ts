import {
    Index,
    Entity,
    Column,
    EntityRepository,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { BaseEntity, BaseRepository } from '../../../abstract'

@Entity({ name: 'callofduty/suspects/reports', database: 'stagg' })
class SuspectReport extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    report_id: string

    @Column('uuid')
    @Index()
    account_id: string

    @Column('citext')
    @Index()
    suspect_name: string

    @Column('text', { nullable: true })
    @Index()
    reconciled_uno_id?: string

    @Column('text', { nullable: true })
    reconciled_match_id?: string
}

@EntityRepository(SuspectReport)
class SuspectReportRepository extends BaseRepository<SuspectReport> {
    protected normailze(entity:Partial<SuspectReport>) {
        return { ...entity }
    }
}

export {
    SuspectReport as Entity,
    SuspectReportRepository as Repository
}
