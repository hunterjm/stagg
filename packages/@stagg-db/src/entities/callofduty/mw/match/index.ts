import {
    Index,
    Column,
    Entity,
    PrimaryColumn,
    FindManyOptions,
    EntityRepository,
} from 'typeorm'
import * as CallOfDuty from '@callofduty/types'
import { BaseEntity, BaseRepository } from '../../../../abstract'

@Entity({ name: 'callofduty/matches/mw', database: 'stagg' })
class Match extends BaseEntity {
    @PrimaryColumn('text')
    combined_id: string // <matchId>.<accountId>

    @Column('text')
    match_id: string

    @Column('uuid')
    @Index()
    account_id: string

    @Column('citext')
    mode_id: CallOfDuty.MW.Mode.MP

    @Column('citext')
    map_id: CallOfDuty.MW.Map.MP

    @Column('integer')
    start_time: number
  
    @Column('integer')
    end_time: number // match.detail

    @Column('integer')
    score_axis: number

    @Column('integer')
    score_allies: number

    @Column('citext')
    team_id: string

    @Column('boolean')
    quit_early: boolean

    @Column('integer')
    stat_score: number

    @Column('smallint')
    stat_time_played: number

    @Column('numeric', { nullable: true })
    stat_avg_life_time?: number

    @Column('smallint')
    stat_team_placement: number

    @Column('integer')
    stat_damage_done: number

    @Column('integer')
    stat_damage_taken: number

    @Column('smallint')
    stat_kills: number

    @Column('smallint')
    stat_deaths: number

    @Column('smallint')
    stat_suicides: number

    @Column('smallint')
    stat_assists: number

    @Column('smallint')
    stat_executions: number

    @Column('smallint')
    stat_headshots: number

    @Column('smallint')
    stat_wall_bangs: number

    @Column('smallint')
    stat_longest_streak: number

    @Column('numeric')
    stat_distance_traveled: number

    @Column('numeric')
    stat_percent_time_moving: number

    @Column('numeric')
    stat_avg_speed: number

    @Column('integer')
    stat_xp_score: number

    @Column('integer')
    stat_xp_match: number

    @Column('integer')
    stat_xp_bonus: number

    @Column('integer')
    stat_xp_medal: number

    @Column('integer')
    stat_xp_misc: number

    @Column('integer')
    stat_xp_challenge: number

    @Column('integer')
    stat_xp_total: number
}


@EntityRepository(Match)
class MatchRepository extends BaseRepository<Match> {
    protected normalize(entity:Omit<Match, 'combined_id'>): Match {
        return { ...entity, combined_id: `${entity.match_id}.${entity.account_id}` }
    }
    
    public async findAll(criteria:Partial<Match>, limit?:number, offset?:number): Promise<Match[]> {
        const options = {
            where: { ...criteria },
            order: { start_time: 'DESC' },
        } as FindManyOptions
        if (limit) options.take = limit
        if (offset) options.skip = offset
        return await this.repository.find(options)
    }
}

export {
    Match as Entity,
    MatchRepository as Repository
}
