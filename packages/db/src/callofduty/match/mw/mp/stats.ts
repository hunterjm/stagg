import { AbstractRepository, Column, Entity, EntityRepository, Index, PrimaryColumn } from 'typeorm'
import { BaseEntity } from '../../../../abstract'
import { Schema as CallOfDuty } from 'callofduty'

@Entity({ name: 'mw/mp/match/stats', database: 'callofduty' })
export class Stats extends BaseEntity {
    @PrimaryColumn('text') // search by match.account
    combinedId: string // <matchId>.<accountId>

    // @ManyToOne(() => Detail, { nullable: false })
    // @JoinColumn({ name: 'matchId' })
    // match: Detail

    // @ManyToOne(() => Account, { nullable: false })
    // @JoinColumn({ name: 'accountId' })
    // account: Account

    // // TODO: this feels weird
    // @ManyToOne(() => AccountProfile, { nullable: false })
    // @JoinColumn({ name: 'profileId' })
    // profile: AccountProfile

    @Column('text')
    matchId: string // match.detail

    @Column('uuid')
    @Index()
    accountId: string // account

    @Column('citext')
    modeId: CallOfDuty.MW.Mode.MP // match.detail

    @Column('citext')
    mapId: CallOfDuty.MW.Map.MP // match.detail

    @Column('integer')
    startTime: number // match.detail
  
    @Column('integer')
    endTime: number // match.detail

    @Column('citext')
    teamId: CallOfDuty.MW.Team

    @Column('text')
    unoId: string // account

    @Column('text')
    username: string // account.profile

    @Column('text', { nullable: true })
    clantag: string

    @Column('boolean')
    quit: boolean

    @Column('integer')
    score: number

    @Column('integer')
    scoreAxis: number

    @Column('integer')
    scoreAllies: number

    @Column('smallint')
    timePlayed: number

    @Column('numeric', { nullable: true })
    avgLifeTime: number

    @Column('smallint')
    teamPlacement: number

    @Column('integer')
    damageDone: number

    @Column('integer')
    damageTaken: number

    @Column('smallint')
    kills: number

    @Column('smallint')
    deaths: number

    @Column('smallint')
    suicides: number

    @Column('smallint')
    assists: number

    @Column('smallint')
    executions: number

    @Column('smallint')
    headshots: number

    @Column('smallint')
    shotsHit: number

    @Column('smallint')
    shotsMiss: number

    @Column('smallint')
    wallBangs: number

    @Column('smallint')
    nearMisses: number

    @Column('smallint')
    longestStreak: number

    @Column('numeric')
    distanceTraveled: number

    @Column('numeric')
    percentTimeMoving: number

    @Column('numeric')
    avgSpeed: number

    @Column('smallint')
    seasonRank: number

    @Column('integer')
    scoreXp: number

    @Column('integer')
    matchXp: number

    @Column('integer')
    bonusXp: number

    @Column('integer')
    medalXp: number

    @Column('integer')
    miscXp: number

    @Column('integer')
    challengeXp: number

    @Column('integer')
    totalXp: number
}

@EntityRepository(Stats)
export class StatsRepository extends AbstractRepository<Stats> {
    private normalize({ matchId, accountId, modeId, mapId, startTime, endTime, teamId, unoId, username, clantag, quit, score, scoreAxis, scoreAllies, timePlayed, avgLifeTime, teamPlacement, damageDone, damageTaken, kills, deaths, suicides, assists, executions, headshots, shotsHit, shotsMiss, wallBangs, nearMisses, longestStreak, distanceTraveled, percentTimeMoving, avgSpeed, seasonRank, scoreXp, matchXp, bonusXp, medalXp, miscXp, challengeXp, totalXp }: Partial<Stats>): Partial<Stats> {
        const combinedId = `${matchId}.${accountId}`
        return { combinedId, matchId, accountId, modeId, mapId, startTime, endTime, teamId, unoId, username, clantag, quit, score, scoreAxis, scoreAllies, timePlayed, avgLifeTime, teamPlacement, damageDone, damageTaken, kills, deaths, suicides, assists, executions, headshots, shotsHit, shotsMiss, wallBangs, nearMisses, longestStreak, distanceTraveled, percentTimeMoving, avgSpeed, seasonRank, scoreXp, matchXp, bonusXp, medalXp, miscXp, challengeXp, totalXp }
    }

    public async insertStats(stats: Partial<Stats>): Promise<Stats> {
        return await this.repository.save(this.normalize(stats))
    }

    public async updateStats(stats: Stats): Promise<Stats> {
        const existing = await this.repository.findOneOrFail(stats.combinedId)
        return await this.repository.save({ ...existing, ...this.normalize(stats) })
    }
}