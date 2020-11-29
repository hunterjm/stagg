import { AbstractRepository, Column, Entity, EntityRepository, FindManyOptions, Index, PrimaryColumn } from 'typeorm'
import { BaseEntity } from '../../../../abstract'
import { Schema as CallOfDuty } from 'callofduty'

@Entity({ name: 'mw/wz/match/stats', database: 'callofduty' })
class Stats extends BaseEntity {
    @PrimaryColumn('text') // find by match.account
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
    matchId: string // match detail
  
    @Column('uuid')
    @Index()
    accountId: string // account
  
    @Column('text')
    modeId: CallOfDuty.MW.Mode.WZ // match detail
  
    @Column('citext')
    mapId: CallOfDuty.MW.Map.WZ // match detail

    @Column('integer')
    startTime: number // match detail
  
    @Column('integer')
    endTime: number // match detail

    @Column('citext')
    teamId: string

    @Column('text')
    unoId: string // account
  
    @Column('text')
    username: string // account profile

    @Column('text', { nullable: true })
    clantag: string

    @Column('integer')
    score: number

    @Column('smallint')
    timePlayed: number

    @Column('numeric', { nullable: true })
    avgLifeTime: number

    @Column('smallint')
    teamPlacement: number

    @Column('integer')
    teamSurvivalTime: number

    @Column('integer')
    damageDone: number

    @Column('integer')
    damageTaken: number

    @Column('smallint')
    kills: number

    @Column('smallint')
    deaths: number

    @Column('smallint', { array: true })
    downs: number[]

    @Column('smallint')
    eliminations: number

    @Column('smallint')
    teamWipes: number

    @Column('smallint')
    executions: number

    @Column('smallint')
    headshots: number

    @Column('smallint')
    revives: number

    @Column('smallint')
    contracts: number

    @Column('smallint')
    lootCrates: number

    @Column('smallint')
    buyStations: number

    @Column('smallint')
    gulagKills: number

    @Column('smallint')
    gulagDeaths: number

    @Column('smallint')
    clusterKills: number

    @Column('smallint')
    airstrikeKills: number

    @Column('smallint')
    longestStreak: number

    @Column('numeric')
    distanceTraveled: number

    @Column('numeric')
    percentTimeMoving: number

    @Column('smallint')
    equipmentDestroyed: number

    @Column('smallint')
    trophyDefense: number

    @Column('smallint')
    munitionShares: number

    @Column('smallint')
    missileRedirects: number

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
class StatsRepository extends AbstractRepository<Stats> {
    private normalize({ matchId, accountId, modeId, mapId, startTime, endTime, teamId, unoId, username, clantag, score, timePlayed, avgLifeTime, teamPlacement, teamSurvivalTime, damageDone, damageTaken, kills, deaths, downs, eliminations, teamWipes, executions, headshots, revives, contracts, lootCrates, buyStations, gulagKills, gulagDeaths, clusterKills, airstrikeKills, longestStreak, distanceTraveled, percentTimeMoving, equipmentDestroyed, trophyDefense, munitionShares, missileRedirects, scoreXp, matchXp, bonusXp, medalXp, miscXp, challengeXp, totalXp }: Partial<Stats>): Partial<Stats> {
        const combinedId = `${matchId}.${accountId}`
        return { combinedId, matchId, accountId, modeId, mapId, startTime, endTime, teamId, unoId, username, clantag, score, timePlayed, avgLifeTime, teamPlacement, teamSurvivalTime, damageDone, damageTaken, kills, deaths, downs, eliminations, teamWipes, executions, headshots, revives, contracts, lootCrates, buyStations, gulagKills, gulagDeaths, clusterKills, airstrikeKills, longestStreak, distanceTraveled, percentTimeMoving, equipmentDestroyed, trophyDefense, munitionShares, missileRedirects, scoreXp, matchXp, bonusXp, medalXp, miscXp, challengeXp, totalXp }
    }

    public async insertStats(stats: Partial<Stats>): Promise<Stats> {
        return await this.repository.save(this.normalize(stats))
    }

    public async updateStats(stats: Stats): Promise<Stats> {
        const existing = await this.repository.findOneOrFail(stats.combinedId)
        return await this.repository.save({ ...existing, ...this.normalize(stats) })
    }

    public async findByAccountId(accountId: string, limit?: number, offset?: number): Promise<Stats[]> {
        const options = {
            where: { accountId },
            order: { startTime: 'DESC' },
        } as FindManyOptions
        if (limit) options.take = limit
        if (offset) options.skip = offset
        return await this.repository.find(options)
    }
}

export {
    Stats as Entity,
    StatsRepository as Repository
}