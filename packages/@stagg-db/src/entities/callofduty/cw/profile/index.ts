import {
    Column,
    Entity,
    PrimaryColumn,
    EntityRepository,
} from 'typeorm'
import { BaseEntity, BaseRepository } from '../../../../abstract'

export * as Mode from './modes'

@Entity({ name: 'callofduty/profiles/cw', database: 'stagg' })
class Profile extends BaseEntity {
    @PrimaryColumn('uuid')
    account_id: string

    @Column('integer')
    stat_level: number

    @Column('integer')
    stat_prestige: number

    @Column('integer')
    stat_current_win_streak: number

    @Column('integer')
    stat_lifetime_score: number

    @Column('integer')
    stat_lifetime_wins: number

    @Column('integer')
    stat_lifetime_draws: number

    @Column('integer')
    stat_lifetime_games: number

    @Column('integer')
    stat_lifetime_kills: number

    @Column('integer')
    stat_lifetime_deaths: number

    @Column('integer')
    stat_lifetime_assists: number

    @Column('integer')
    stat_lifetime_suicides: number

    @Column('integer')
    stat_lifetime_headshots: number

    @Column('integer')
    stat_lifetime_shots_hit: number

    @Column('integer')
    stat_lifetime_shots_missed: number

    @Column('integer')
    stat_lifetime_time_played: number

    @Column('integer')
    stat_lifetime_highest_kill_streak: number
}

@EntityRepository(Profile)
class ProfileRepository extends BaseRepository<Profile> {
    protected normalize(entity:Profile): Profile {
        return { ...entity }
    }
    public async update(entity:Profile): Promise<Profile> {
        const existing = await this.repository.findOneOrFail(entity.account_id)
        return this.repository.save({ ...existing, ...this.normailze(entity) })
    }
}

export {
    Profile as Entity,
    ProfileRepository as Repository
}
