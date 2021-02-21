import {
    Index,
    Column,
    Entity,
    PrimaryColumn,
    FindManyOptions,
    EntityRepository,
} from 'typeorm'
import { BaseEntity, BaseRepository } from '../../../../abstract'

@Entity({ name: 'callofduty/cw/matches', database: 'stagg' })
class Match extends BaseEntity {
    @PrimaryColumn('text')
    combined_id: string // <matchId>.<accountId>

    @Column('text')
    match_id: string

    @Column('uuid')
    @Index()
    account_id: string

    // @Column('citext')
    // mode_id: CallOfDuty.MW.Mode.MP

    // @Column('citext')
    // map_id: CallOfDuty.MW.Map.MP
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
