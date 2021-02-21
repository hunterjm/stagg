import {
    Entity,
    Column,
    EntityRepository,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { BaseEntity, BaseRepository } from '../../../abstract'

@Entity({ name: 'discord/settings/features', database: 'stagg' })
class FeatureSettings extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('citext')
    feature_flag: string

    @Column('citext')
    entity_type: 'user' | 'channel' | 'server'

    @Column('text')
    entity_id: string
}

@EntityRepository(FeatureSettings)
class FeatureSettingsRepository extends BaseRepository<FeatureSettings> {
    protected normailze(entity:Partial<FeatureSettings>) {
        return { ...entity }
    }
}

export {
    FeatureSettings as Entity,
    FeatureSettingsRepository as Repository,
}
