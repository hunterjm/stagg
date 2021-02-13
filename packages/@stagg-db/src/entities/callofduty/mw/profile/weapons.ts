import {
    Index,
    Column,
    Entity,
    PrimaryColumn,
    EntityRepository,
} from 'typeorm'
import * as CallOfDuty from '@callofduty/types'
import { BaseEntity, BaseRepository } from '../../../../abstract'

@Entity({ name: 'callofduty/profiles/mw/weapons', database: 'stagg' })
class ProfileWeaponMW extends BaseEntity {
    @PrimaryColumn('text')
    combined_id: string // <account_id>.<weapon_id>

    @Column('uuid')
    @Index()
    account_id: string

    @Column('citext')
    weapon_id: CallOfDuty.MW.Weapon.Name

    @Column('integer')
    stat_kills: number

    @Column('integer')
    stat_deaths: number

    @Column('integer')
    stat_headshots: number

    @Column('integer')
    stat_shots_hit: number

    @Column('integer')
    stat_shots_missed: number
}

@EntityRepository(ProfileWeaponMW)
class ProfileWeaponMWRepository extends BaseRepository<ProfileWeaponMW> {
    protected normalize(entity:ProfileWeaponMW): ProfileWeaponMW {
        return { ...entity, combined_id: `${entity.account_id}.${entity.weapon_id}` }
    }
    public async update(entity:ProfileWeaponMW): Promise<ProfileWeaponMW> {
        const existing = await this.repository.findOneOrFail(entity.account_id)
        return this.repository.save({ ...existing, ...this.normailze(entity) })
    }
}

export {
    ProfileWeaponMW as Entity,
    ProfileWeaponMWRepository as Repository
}
