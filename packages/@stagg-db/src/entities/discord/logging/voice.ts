import {
    Entity,
    Column,
    EntityRepository,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { BaseEntity, BaseRepository } from '../../../abstract'

@Entity({ name: 'discord/logging/voice', database: 'stagg' })
class VoiceState extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text')
    user_id: string

    @Column('text')
    server_id: string

    @Column('text')
    channel_id: string

    @Column('citext')
    activity_type: 'join' | 'leave'
}

@EntityRepository(VoiceState)
class VoiceStateRepository extends BaseRepository<VoiceState> {
    protected normailze(entity:Partial<VoiceState>) {
        return { ...entity }
    }
}

export {
    VoiceState as Entity,
    VoiceStateRepository as Repository,
}
