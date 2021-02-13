import {
    Index,
    Entity,
    Column,
    PrimaryColumn,
    EntityRepository,
} from 'typeorm'
import * as CallOfDuty from '@callofduty/types'
import { BaseEntity, BaseRepository } from '../../abstract'

@Entity({ name: 'callofduty/friends', database: 'stagg' })
class Friend extends BaseEntity {
    @PrimaryColumn('text')
    combined_id: string // <account_id>.<friend-uno_id>

    @Column('uuid')
    @Index()
    account_id: string

    @Column('citext')
    friendship_platform: CallOfDuty.Platform

    @Column('boolean')
    friend_online_status: boolean

    @Column('citext')
    friend_uno_id: string

    @Column('citext')
    friend_uno_username: string

    @Column('citext', { nullable: true })
    friend_current_game?: CallOfDuty.Game

    @Column('citext', { nullable: true })
    friend_console_username?: string

    @Column('citext', { nullable: true })
    friend_console_avatar_url?: string
}

@EntityRepository(Friend)
class FriendRepository extends BaseRepository<Friend> {
    protected normailze(entity:Partial<Friend>) {
        return { ...entity }
    }
    public prune(account_id:string, valid_friend_uno_ids:string[]) {
        return this.repository.createQueryBuilder('callofduty/friends')
        .where(`account_id=:account_id AND NOT (friend_uno_id = ANY(:valid_friend_uno_ids))`, { account_id, valid_friend_uno_ids })
        .delete()
        .execute()
    }
}

export {
    Friend as Entity,
    FriendRepository as Repository
}
