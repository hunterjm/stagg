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

@Entity({ name: 'callofduty/wz/loadouts', database: 'stagg' })
class LoadoutWZ extends BaseEntity {
    @PrimaryColumn('text')
    combined_id: string // <matchId>.<accountId>.<index>

    @Column('text')
    match_id: string

    @Column('uuid')
    @Index()
    account_id: string

    @Column('citext', { nullable: true })
    equip_lethal_id: string

    @Column('citext', { nullable: true })
    equip_tactical_id: string

    @Column('citext', { nullable: true })
    perk_slot_1: string

    @Column('citext', { nullable: true })
    perk_slot_2: string

    @Column('citext', { nullable: true })
    perk_slot_3: string

    @Column('citext', { nullable: true })
    perk_extra_1: string

    @Column('citext', { nullable: true })
    perk_extra_2: string

    @Column('citext', { nullable: true })
    perk_extra_3: string

    @Column('citext', { nullable: true })
    primary_weapon_id: CallOfDuty.MW.Weapon.Name

    @Column('integer', { nullable: true })
    primary_weapon_var: number

    @Column('citext', { nullable: true })
    primary_weapon_att_1: string

    @Column('citext', { nullable: true })
    primary_weapon_att_2: string

    @Column('citext', { nullable: true })
    primary_weapon_att_3: string

    @Column('citext', { nullable: true })
    primary_weapon_att_4: string

    @Column('citext', { nullable: true })
    primary_weapon_att_5: string

    @Column('citext', { nullable: true })
    secondary_weapon_id: CallOfDuty.MW.Weapon.Name

    @Column('integer', { nullable: true })
    secondary_weapon_var: number

    @Column('citext', { nullable: true })
    secondary_weapon_att_1: string

    @Column('citext', { nullable: true })
    secondary_weapon_att_2: string

    @Column('citext', { nullable: true })
    secondary_weapon_att_3: string

    @Column('citext', { nullable: true })
    secondary_weapon_att_4: string

    @Column('citext', { nullable: true })
    secondary_weapon_att_5: string
}

@EntityRepository(LoadoutWZ)
class LoadoutWZRepository extends BaseRepository<LoadoutWZ> {
    protected normalize(index:number, entity:Omit<LoadoutWZ, 'combined_id'>): LoadoutWZ {
        return { ...entity, combined_id: `${entity.match_id}.${entity.account_id}.${index}` }
    }
    
    public async findAll(criteria:Partial<LoadoutWZ>, limit?:number, offset?:number): Promise<LoadoutWZ[]> {
        const options = {
            where: { ...criteria },
            order: { start_time: 'DESC' },
        } as FindManyOptions
        if (limit) options.take = limit
        if (offset) options.skip = offset
        return this.repository.find(options)
    }
}

export {
    LoadoutWZ as Entity,
    LoadoutWZRepository as Repository
}
