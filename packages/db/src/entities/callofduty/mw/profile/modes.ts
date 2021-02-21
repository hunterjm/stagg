import {
    Index,
    Column,
    Entity,
    PrimaryColumn,
    EntityRepository,
} from 'typeorm'
import * as CallOfDuty from '@callofduty/types'
import { BaseEntity, BaseRepository } from '../../../../abstract'

@Entity({ name: 'callofduty/mw/profiles/modes', database: 'stagg' })
class ProfileModeMW extends BaseEntity {
    @PrimaryColumn('text')
    combined_id: string // <account_id>.<mode_id>
    
    @Column('uuid')
    @Index()
    account_id: string

    @Column('citext')
    mode_id: CallOfDuty.MW.Mode.MP

    @Column('integer')
    stat_score: number

    @Column('integer')
    stat_kills: number

    @Column('integer')
    stat_deaths: number

    @Column('integer')
    stat_time_played: number

    @Column('integer', { nullable: true })
    stat_damage_done: number

    @Column('integer', { nullable: true })
    stat_objective_time: number

    @Column('integer', { nullable: true })
    stat_objective_defend: number

    @Column('integer', { nullable: true })
    stat_objective_capture: number
}

@EntityRepository(ProfileModeMW)
class ProfileModeMWRepository extends BaseRepository<ProfileModeMW> {
    protected normalize(entity:ProfileModeMW): ProfileModeMW {
        return { ...entity, combined_id: `${entity.account_id}.${entity.mode_id}` }
    }
    public async update(entity:ProfileModeMW): Promise<ProfileModeMW> {
        const existing = await this.repository.findOneOrFail(entity.account_id)
        return this.repository.save({ ...existing, ...this.normailze(entity) })
    }
}

export {
    ProfileModeMW as Entity,
    ProfileModeMWRepository as Repository
}
