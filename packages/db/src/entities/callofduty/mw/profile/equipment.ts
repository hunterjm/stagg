import {
    Index,
    Column,
    Entity,
    PrimaryColumn,
    EntityRepository,
} from 'typeorm'
import { BaseEntity, BaseRepository } from '../../../../abstract'

@Entity({ name: 'callofduty/mw/profiles/equipment', database: 'stagg' })
class ProfileEquipmentMW extends BaseEntity {
    @PrimaryColumn('text')
    combined_id: string // <account_id>.<equipment_id>

    @Column('uuid')
    @Index()
    account_id: string

    @Column('citext')
    equipment_type: 'tactical' | 'lethal'

    @Column('citext')
    equipment_id: string

    @Column('integer')
    stat_uses: number

    @Column('integer')
    stat_hits: number // kills for lethal
}

@EntityRepository(ProfileEquipmentMW)
class ProfileEquipmentMWRepository extends BaseRepository<ProfileEquipmentMW> {
    protected normalize(entity:ProfileEquipmentMW): ProfileEquipmentMW {
        return { ...entity, combined_id: `${entity.account_id}.${entity.equipment_id}` }
    }
    public async update(entity:ProfileEquipmentMW): Promise<ProfileEquipmentMW> {
        const existing = await this.repository.findOneOrFail(entity.account_id)
        return this.repository.save({ ...existing, ...this.normailze(entity) })
    }
}

export {
    ProfileEquipmentMW as Entity,
    ProfileEquipmentMWRepository as Repository
}
