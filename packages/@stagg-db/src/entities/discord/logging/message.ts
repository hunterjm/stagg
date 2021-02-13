import {
    Entity,
    Column,
    PrimaryColumn,
    EntityRepository,
} from 'typeorm'
import { BaseEntity, BaseRepository } from '../../../abstract'

@Entity({ name: 'discord/logging/messages', database: 'stagg' })
class Message extends BaseEntity {
    @PrimaryColumn('text')
    id: string

    @Column('text')
    author: string

    @Column('citext')
    content: string

    @Column('text', { nullable: true })
    server_id: string

    @Column('text', { nullable: true })
    channel_id: string
}

@EntityRepository(Message)
class MessageRepository extends BaseRepository<Message> {
    protected normailze(entity:Partial<Message>) {
        return { ...entity }
    }
}

export {
    Message as Entity,
    MessageRepository as Repository,
}
