import {
    Column,
    Entity,
    PrimaryColumn,
    EntityRepository,
} from 'typeorm'
import { BaseEntity, BaseRepository } from '../../../../abstract'

export * as Mode from './modes'
export * as Weapon from './weapons'
export * as Equipment from './equipment'

@Entity({ name: 'callofduty/profiles/mw', database: 'stagg' })
class ProfileMW extends BaseEntity {
    @PrimaryColumn('uuid')
    account_id: string

    @Column('integer')
    stat_level: number

    @Column('integer')
    stat_level_xp_gained: number

    @Column('integer')
    stat_level_xp_remainder: number

    @Column('integer')
    stat_prestige: number
    
    @Column('integer')
    stat_current_win_streak: number

    @Column('integer')
    stat_lifetime_xp: number

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
    stat_lifetime_highest_win_streak: number

    @Column('integer')
    stat_lifetime_highest_kill_streak: number

    @Column('numeric')
    stat_lifetime_highest_kdr_match: number

    @Column('integer')
    stat_lifetime_highest_xp_match: number

    @Column('integer')
    stat_lifetime_highest_spm_match: number

    @Column('integer')
    stat_lifetime_highest_score_match: number

    @Column('integer')
    stat_lifetime_highest_kills_match: number

    @Column('integer')
    stat_lifetime_highest_deaths_match: number

    @Column('integer')
    stat_lifetime_highest_assists_match: number
}

@EntityRepository(ProfileMW)
class ProfileMWRepository extends BaseRepository<ProfileMW> {
    protected normalize(entity:ProfileMW): ProfileMW {
        return { ...entity }
    }
    public async update(entity:ProfileMW): Promise<ProfileMW> {
        const existing = await this.repository.findOneOrFail(entity.account_id)
        return this.repository.save({ ...existing, ...this.normailze(entity) })
    }
}

export {
    ProfileMW as Entity,
    ProfileMWRepository as Repository
}
