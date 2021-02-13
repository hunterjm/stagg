import {
    Entity,
    Column,
    EntityRepository,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { BaseEntity, BaseRepository } from '../../abstract'

@Entity({ name: 'discord/features/enablement', database: 'stagg' })
class FeatureFlag extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('citext')
    feature_flag: string

    @Column('citext')
    entity_type: 'user' | 'channel' | 'server'

    @Column('text')
    entity_id: string
}

@EntityRepository(FeatureFlag)
class FeatureFlagRepository extends BaseRepository<FeatureFlag> {
    protected normailze(entity:Partial<FeatureFlag>) {
        return { ...entity }
    }
}

export {
    FeatureFlag as Entity,
    FeatureFlagRepository as Repository,
}
