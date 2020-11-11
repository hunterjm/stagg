import { Schema } from 'callofduty'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Entity, Column, Repository, PrimaryColumn, InsertResult } from 'typeorm'

/************************************************************************************************************
 * Modern Warfare - Multiplayer - Match Player Weapon Stats
 ***********************************************************************************************************/
export const MwMpMatchWeaponNormalizer = (match:Schema.MW.Match.MP, accountId:string):Partial<MwMpMatchWeapon>[] => {
  const weapons = []
  for (const weaponId in match.weaponStats) {
      weapons.push({
        weaponId,
        accountId,
        matchId: match.matchID,
        combinedId: `${match.matchID}.${accountId}.${weaponId}`,
        loadoutIndex: match.weaponStats[weaponId].loadoutIndex,
        kills: match.weaponStats[weaponId].kills,
        deaths: match.weaponStats[weaponId].deaths,
        headshots: match.weaponStats[weaponId].headshots,
        shotsHit: match.weaponStats[weaponId].hits,
        shotsMiss: match.weaponStats[weaponId].shots - match.weaponStats[weaponId].hits,
        xpStart: match.weaponStats[weaponId].startingWeaponXp,
        xpEarned: match.weaponStats[weaponId].xpEarned,
      })
  }
  return weapons
}

@Entity({ name: 'mw/mp/match/weapons', database: 'callofduty' })
export class MwMpMatchWeapon {
    @PrimaryColumn('text', { unique: true })
    combinedId: string // <matchId>.<accountId>.<weaponId>

    @Column('text')
    matchId: string

    @Column('uuid')
    accountId: string

    @Column('citext')
    weaponId: Schema.MW.Weapon.Name

    @Column('citext')
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
@Injectable()
export class MwMpMatchWeaponDAO {
    constructor(
      @InjectRepository(MwMpMatchWeapon, 'callofduty') private repo: Repository<MwMpMatchWeapon>,
    ) {}
    private normalizeModel(weaponStats:Partial<MwMpMatchWeapon>) {
      return {
        ...weaponStats,
        combinedId: `${weaponStats.matchId}.${weaponStats.accountId}.${weaponStats.weaponId}`,
      }
    }
    public async insert(model:Partial<MwMpMatchWeapon>):Promise<InsertResult> {
      return this.repo.createQueryBuilder()
        .insert()
        .into(MwMpMatchWeapon)
        .values(this.normalizeModel(model))
        .execute()
    }
    public async findById(matchId:string, accountId:string, weaponId:Schema.MW.Weapon.Name):Promise<MwMpMatchWeapon> {
        return this.repo.findOne({ where: { accountId, matchId, weaponId } })
    }
    public async findAllByMatchId(matchId:string, accountId:string):Promise<MwMpMatchWeapon[]> {
        return this.repo.find({ where: { accountId, matchId } })
    }
    public async findAllByWeaponId(accountId:string, weaponId:Schema.MW.Weapon.Name):Promise<MwMpMatchWeapon[]> {
        return this.repo.find({ where: { weaponId, accountId } })
    }
}
