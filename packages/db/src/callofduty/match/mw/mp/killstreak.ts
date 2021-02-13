import { AbstractRepository, Column, Entity, EntityRepository, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import * as Detail from './detail'
import * as Account from '../../../account'
import { Schema as CallOfDuty } from 'callofduty'
import { BaseEntity } from '../../../../abstract'

@Entity({ name: 'mw/mp/match/killstreaks', database: 'callofduty' })
@Index('idx_mwmp_killstreak_matchaccount', ['match', 'account'])
class Killstreak extends BaseEntity {
    @PrimaryColumn('text')
    combinedId: string // <matchId>.<accountId>.<killstreakId>

    @ManyToOne(() => Detail.Entity, { nullable: false })
    @JoinColumn({ name: 'matchId' })
    match: Detail.Entity
    
    @ManyToOne(() => Account.Base.Entity, { nullable: false })
    @JoinColumn({ name: 'accountId' })
    account: Account.Base.Entity

    @Column('citext')
    killstreakId: CallOfDuty.MW.Killstreak

    @Column('smallint')
    uses: number

    @Column('smallint')
    kills: number

    @Column('smallint')
    takedowns: number
}

@EntityRepository(Killstreak)
class KillstreakRepository extends AbstractRepository<Killstreak> {
    private normalize({ match, account, killstreakId, uses, kills, takedowns }: Partial<Killstreak>): Partial<Killstreak> {
        const combinedId = `${match.matchId}.${account.accountId}.${killstreakId}`
        return { combinedId, match, account, killstreakId, uses, kills, takedowns }
    }

    public async insertKillstreak(killstreak: Partial<Killstreak>): Promise<Killstreak> {
        return await this.repository.save(this.normalize(killstreak))
    }

    public async updateKillstreak(killstreak: Killstreak): Promise<Killstreak> {
        const existing = await this.repository.findOneOrFail(killstreak.combinedId)
        return await this.repository.save({ ...existing, ...this.normalize(killstreak) })
    }

    public async findKillstreaks(matchId:string, accountId:string): Promise<Killstreak[]> {
        return await this.repository.find({ where: { match: { matchId }, account: { accountId } }})
    }
}

export {
    Killstreak as Entity,
    KillstreakRepository as Repository
}