import {
    Column,
    Entity,
    PrimaryColumn,
    EntityRepository,
} from 'typeorm'
import * as CallOfDuty from '@callofduty/types'
import { BaseEntity, BaseRepository } from '../../../../abstract'

@Entity({ name: 'callofduty/cw/profiles/modes', database: 'stagg' })
class ProfileMode extends BaseEntity {
    @PrimaryColumn('uuid')
    account_id: string

    @Column('citext')
    mode_id: CallOfDuty.MW.Mode.MP

    @Column('integer')
    stat_level: number
}

@EntityRepository(ProfileMode)
class ProfileModeRepository extends BaseRepository<ProfileMode> {
    protected normalize(entity:ProfileMode): ProfileMode {
        return { ...entity }
    }
    public async update(entity:ProfileMode): Promise<ProfileMode> {
        const existing = await this.repository.findOneOrFail(entity.account_id)
        return this.repository.save({ ...existing, ...this.normailze(entity) })
    }
}

export {
    ProfileMode as Entity,
    ProfileModeRepository as Repository
}
