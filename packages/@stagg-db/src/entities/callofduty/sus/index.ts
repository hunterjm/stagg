import {
    Index,
    Entity,
    Column,
    PrimaryColumn,
    EntityRepository,
} from 'typeorm'
import * as CallOfDuty from '@callofduty/types'
import { BaseEntity, BaseRepository } from '../../../abstract'

export * as Match from './matches'
export * as Report from './reports'

@Entity({ name: 'callofduty/suspects', database: 'stagg' })
class Suspect extends BaseEntity {
    @PrimaryColumn('text')
    combined_id: string // <uno_id>.<match_id>

    @Column('text')
    @Index()
    uno_id: string

    @Column('text')
    @Index()
    match_id: string

    @Column('citext', { array: true })
    reasons: string[]

    @Column('jsonb')
    match_log: CallOfDuty.MW.Match.WZ
}

@EntityRepository(Suspect)
class SuspectRepository extends BaseRepository<Suspect> {
    protected normailze(entity:Partial<Suspect>) {
        return { ...entity }
    }
}

export {
    Suspect as Entity,
    SuspectRepository as Repository
}
