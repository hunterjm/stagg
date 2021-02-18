import {
    Index,
    Column,
    Entity,
    PrimaryColumn,
    EntityRepository,
} from 'typeorm'
import * as CallOfDuty from '@callofduty/types'
import { BaseEntity, BaseRepository } from '../../../../abstract'

@Entity({ name: 'callofduty/wz/profiles/modes', database: 'stagg' })
class ProfileModeWZ extends BaseEntity {
    @PrimaryColumn('text')
    combined_id: string // <account_id>.<mode_id>

    @Column('uuid')
    @Index()
    account_id: string

    @Column('citext')
    mode_id: CallOfDuty.MW.Mode.WZ

    @Column('integer')
    stat_wins: number

    @Column('integer')
    stat_games: number

    @Column('integer')
    stat_top5: number

    @Column('integer')
    stat_top10: number

    @Column('integer')
    stat_top25: number

    @Column('integer')
    stat_score: number

    @Column('integer')
    stat_kills: number

    @Column('integer')
    stat_downs: number

    @Column('integer')
    stat_deaths: number

    @Column('integer')
    stat_contracts: number

    @Column('integer')
    stat_revives: number

    @Column('integer')
    stat_cash: number

    @Column('integer')
    stat_time_played: number
}

@EntityRepository(ProfileModeWZ)
class ProfileModeWZRepository extends BaseRepository<ProfileModeWZ> {
    protected normalize(entity:ProfileModeWZ): ProfileModeWZ {
        return { ...entity, combined_id: `${entity.account_id}.${entity.mode_id}` }
    }
    public async update(entity:ProfileModeWZ): Promise<ProfileModeWZ> {
        const existing = await this.repository.findOneOrFail(entity.account_id)
        return this.repository.save({ ...existing, ...this.normailze(entity) })
    }
}

export {
    ProfileModeWZ as Entity,
    ProfileModeWZRepository as Repository
}
