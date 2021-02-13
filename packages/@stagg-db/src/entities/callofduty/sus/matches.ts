import {
    Entity,
    PrimaryColumn,
    EntityRepository,
} from 'typeorm'
import { BaseEntity, BaseRepository } from '../../../abstract'

@Entity({ name: 'callofduty/suspects/matches', database: 'stagg' })
class SuspectInvestigation extends BaseEntity {
    @PrimaryColumn('text')
    match_id?: string
}

@EntityRepository(SuspectInvestigation)
class SuspectInvestigationRepository extends BaseRepository<SuspectInvestigation> {
    protected normailze(entity:Partial<SuspectInvestigation>) {
        return { ...entity }
    }
}

export {
    SuspectInvestigation as Entity,
    SuspectInvestigationRepository as Repository
}
