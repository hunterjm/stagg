import { AbstractRepository, Column, Entity, EntityRepository, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { Account } from '../../../account/account'
import { Detail } from './detail'
import { Schema as CallOfDuty } from 'callofduty'
import { BaseEntity } from '../../../../abstract'

@Entity({ name: 'mw/mp/match/weapons', database: 'callofduty' })
@Index('idx_mwmp_weapon_matchaccount', ['match', 'account'])
export class Weapon extends BaseEntity {
    @PrimaryColumn('text')
    combinedId: string // <matchId>.<accountId>.<weaponId>
    
    @ManyToOne(() => Detail, { nullable: false })
    @JoinColumn({ name: 'matchId' })
    match: Detail

    @ManyToOne(() => Account, { nullable: false })
    @JoinColumn({ name: 'accountId' })
    account: Account

    @Column('citext')
    weaponId: CallOfDuty.MW.Weapon.Name

    @Column('smallint')
    loadoutIndex: number

    @Column('smallint')
    kills: number

    @Column('smallint')
    deaths: number

    @Column('smallint')
    headshots: number

    @Column('smallint')
    shotsHit: number

    @Column('smallint')
    shotsMiss: number

    @Column('integer')
    xpStart: number

    @Column('integer')
    xpEarned: number
}

@EntityRepository(Weapon)
export class WeaponRepository extends AbstractRepository<Weapon> {
    private normalize({ match, account, weaponId, loadoutIndex, kills, deaths, headshots, shotsHit, shotsMiss, xpStart, xpEarned }: Partial<Weapon>): Partial<Weapon> {
        const combinedId = `${match.matchId}.${account.accountId}.${weaponId}`
        return { combinedId, match, account, weaponId, loadoutIndex, kills, deaths, headshots, shotsHit, shotsMiss, xpStart, xpEarned }
    }

    public async insertWeapon(weapon: Partial<Weapon>): Promise<Weapon> {
        return await this.repository.save(this.normalize(weapon))
    }

    public async updateWeapon(weapon: Weapon): Promise<Weapon> {
        const existing = await this.repository.findOneOrFail(weapon.combinedId)
        return await this.repository.save({ ...existing, ...this.normalize(weapon) })
    }
}