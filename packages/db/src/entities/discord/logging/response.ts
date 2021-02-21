import {
    Entity,
    Column,
    PrimaryColumn,
    EntityRepository,
} from 'typeorm'
import { BaseEntity, BaseRepository } from '../../../abstract'

@Entity({ name: 'discord/logging/responses', database: 'stagg' })
class Response extends BaseEntity {
    @PrimaryColumn('text')
    id: string

    @Column('text')
    author: string

    @Column('citext')
    content: string

    @Column('citext', { nullable: true, array: true })
    files?: string[]

    @Column('citext', { nullable: true, array: true })
    attachments?: string[]
}

@EntityRepository(Response)
class ResponseRepository extends BaseRepository<Response> {
    protected normailze(entity:Partial<Response>) {
        return { ...entity }
    }
}

export {
    Response as Entity,
    ResponseRepository as Repository
}
