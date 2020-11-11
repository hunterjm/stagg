import { Schema, Assets } from 'callofduty'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Entity, Column, Repository, PrimaryColumn, InsertResult } from 'typeorm'

/************************************************************************************************************
 * Modern Warfare - Multiplayer - Match Player Killstreak Stats
 ***********************************************************************************************************/
export type NormalizedKillstreaks = { killstreakId: Schema.Killstreak, uses:number, kills:number, takedowns:number }[]
export const MwMpMatchKillstreakNormalizer = ({ player, playerStats, matchID }:Schema.MW.Match.MP, accountId:string):NormalizedKillstreaks => {
  const killstreaks = []
  for(const killstreakId in Assets.MW.Killstreaks) {
      const { props } = Assets.MW.Killstreak(killstreakId as Schema.Killstreak)
      const uses = player.killstreakUsage[killstreakId] || 0
      const kills = playerStats[props.kills] || 0
      const takedowns = playerStats[props.takedowns] || 0
      if (!uses && !kills && !takedowns) {
        continue
      }
      killstreaks.push({
        uses,
        kills,
        takedowns,
        accountId,
        killstreakId,
        matchId: matchID,
        combinedId: `${matchID}.${accountId}.${killstreakId}`,
      })
  }
  return killstreaks
}
@Entity({ name: 'mw/mp/match/killstreaks', database: 'callofduty' })
export class MwMpMatchKillstreak {
    @PrimaryColumn('text', { unique: true })
    combinedId: string // <matchId>.<accountId>.<killstreakId>

    @Column('text')
    matchId: string

    @Column('uuid')
    accountId: string

    @Column('citext')
    killstreakId: Schema.MW.Killstreak

    @Column('smallint')
    uses: number

    @Column('smallint')
    kills: number

    @Column('smallint')
    takedowns: number
}
@Injectable()
export class MwMpMatchKillstreakDAO {
    constructor(
      @InjectRepository(MwMpMatchKillstreak, 'callofduty') private matchRecordRepo: Repository<MwMpMatchKillstreak>,
    ) {}
    private normalizeModel(match:Partial<MwMpMatchKillstreak>) {
      return {
        ...match,
      }
    }
    public async insert(match:Partial<MwMpMatchKillstreak>):Promise<InsertResult> {
      return this.matchRecordRepo.createQueryBuilder()
        .insert()
        .into(MwMpMatchKillstreak)
        .values(this.normalizeModel(match))
        .execute()
    }
    public async findById(matchId:string, accountId:string, killstreakId:Schema.MW.Killstreak):Promise<MwMpMatchKillstreak> {
        return this.matchRecordRepo.findOne({ where: { accountId, matchId, killstreakId } })
    }
}
