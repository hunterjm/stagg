import {
    Index,
    Column,
    Entity,
    PrimaryColumn,
    FindManyOptions,
    EntityRepository,
} from 'typeorm'
import * as CallOfDuty from '@callofduty/types'
import { BaseEntity, BaseRepository } from '../../../abstract'
import { arrayTransformer } from '../../../util'

@Entity({ name: 'callofduty/wz/matches', database: 'stagg' })
class MatchWZ extends BaseEntity {
    @PrimaryColumn('text')
    combined_id: string // <matchId>.<accountId>

    @Column('text')
    match_id: string

    @Column('uuid')
    @Index()
    account_id: string

    @Column('citext')
    mode_id: CallOfDuty.MW.Mode.WZ

    @Column('citext')
    map_id: CallOfDuty.MW.Map.WZ

    @Column('integer')
    start_time: number
  
    @Column('integer')
    end_time: number

    @Column('citext')
    team_id: string

    @Column('integer')
    stat_score: number

    @Column('smallint')
    stat_time_played: number

    @Column('numeric', { nullable: true })
    stat_avg_life_time?: number

    @Column('smallint')
    stat_team_placement: number

    @Column('integer')
    stat_team_survival_time: number

    @Column('integer')
    stat_damage_done: number

    @Column('integer')
    stat_damage_taken: number

    @Column('smallint')
    stat_kills: number

    @Column('smallint')
    stat_deaths: number

    @Column('smallint', { array: true, transformer: arrayTransformer })
    stat_downs: number[]

    @Column('smallint')
    stat_team_wipes: number

    @Column('smallint')
    stat_executions: number

    @Column('smallint')
    stat_headshots: number

    @Column('smallint')
    stat_revives: number

    @Column('smallint')
    stat_contracts: number

    @Column('smallint')
    stat_loot_crates: number

    @Column('smallint')
    stat_buy_stations: number

    @Column('smallint')
    stat_gulag_kills: number

    @Column('smallint')
    stat_gulag_deaths: number

    @Column('smallint')
    stat_cluster_kills: number

    @Column('smallint')
    stat_airstrike_kills: number

    @Column('smallint')
    stat_longest_streak: number

    @Column('numeric')
    stat_distance_traveled: number

    @Column('numeric')
    stat_percent_time_moving: number

    @Column('smallint')
    stat_equipment_destroyed: number

    @Column('smallint')
    stat_trophy_defense: number

    @Column('smallint')
    stat_munition_shares: number

    @Column('smallint')
    stat_missile_redirects: number

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

@EntityRepository(MatchWZ)
class MatchWZRepository extends BaseRepository<MatchWZ> {
    protected normalize(entity:Omit<MatchWZ, 'combined_id'>): MatchWZ {
        return { ...entity, combined_id: `${entity.match_id}.${entity.account_id}` }
    }
    
    public async findAll(criteria:Partial<MatchWZ>, limit?:number, offset?:number): Promise<MatchWZ[]> {
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
    MatchWZ as Entity,
    MatchWZRepository as Repository
}
