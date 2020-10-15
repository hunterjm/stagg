import { Schema } from '@stagg/callofduty'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Entity, Column, Repository, PrimaryColumn, InsertResult, UpdateResult, Index } from 'typeorm'
import { Postgres } from 'src/util'

export interface Loadout {
  primary: Loadout.Weapon
  secondary: Loadout.Weapon
  lethal: string
  tactical: string
  perks: string[]
  killstreaks: string[]
}
export namespace Loadout {
  export interface Weapon {
      weapon: Schema.API.MW.Loadout.Weapon.Name
      variant: number
      attachments: string[]
  }
}
export interface Weapon {
  loadout: number
  kills: number
  deaths: number
  headshots: number
  shots: {
      hit: number
      miss: number
  }
  xp: {
      start: number
      earned: number
  }
}
export interface Killstreak {
  uses: number
  kills: number
  takedowns: number
}
export interface Objectives {
  // Flags, etc
  captureKill: number
  defenseKill: number
  defendScore: number
  assaultScore: number
  captureScore: number // dom cap
  captureScoreB: number // dom cap B flag
  captureAssistScore: number // dom cap assist
  captureNeutralScore: number // dom cap B flag
  // Kill Confirmed
  tagOwn: number
  tagDeny: number
  tagConfirm: number
  tagFriendly: number
  // Misc
  gainedGunRank: number
  equipmentDestroyed: number
}

/************************************************************************************************************
 * Modern Warfare - Multiplayer - Match Details
 ***********************************************************************************************************/
@Entity({ name: 'mw/mp/match/details' })
export class MwMpMatchDetails {
  @PrimaryColumn()
  @Index({ unique: true })
  matchId: string

  @Column('citext')
  modeId: Schema.API.MW.Match.Mode

  @Column('citext')
  mapId: Schema.API.MW.Map

  @Column('integer')
  startTime: number

  @Column('integer')
  endTime: number

  @Column('timestamp')
  created: Date
}
@Injectable()
export class MwMpMatchDetailsDAO {
  constructor(
    @InjectRepository(MwMpMatchDetails) private matchDetailsRepo: Repository<MwMpMatchDetails>,
  ) {}
  private normalizeModel(match:MwMpMatchDetails) {
    return { ...match }
  }
  public async insert(match:MwMpMatchDetails):Promise<InsertResult> {
    return this.matchDetailsRepo.createQueryBuilder()
      .insert()
      .into(MwMpMatchDetails)
      .values(this.normalizeModel(match))
      .execute()
  }
  public async update(match:MwMpMatchDetails):Promise<UpdateResult> {
    return this.matchDetailsRepo.createQueryBuilder()
      .update()
      .set(this.normalizeModel(match))
      .where({ matchId: match.matchId })
      .execute()
  }
  public async findById(matchId:string):Promise<MwMpMatchDetails> {
      const match = await this.matchDetailsRepo.findOne(matchId)
      return Postgres.Denormalize.Model<MwMpMatchDetails>(match)
  }
}
/************************************************************************************************************
 * Modern Warfare - Multiplayer - Match Records
 ***********************************************************************************************************/
@Entity({ name: 'mw/mp/match/records' })
export class MwMpMatchRecord {
  @PrimaryColumn('uuid')
  id: string

  @Column('uuid')
  accountId: string

  @Column('text')
  matchId: string

  @Column('citext')
  modeId: Schema.API.MW.Match.Mode

  @Column('citext')
  mapId: Schema.API.MW.Map

  @Column('citext')
  teamId: string

  @Column('citext')
  unoId: string

  @Column('citext')
  username: string

  @Column('citext')
  clantag: string

  @Column('integer')
  score: number

  @Column('numeric')
  timePlayed: number

  @Column('numeric')
  avgLifeTime: number

  @Column('integer')
  teamPlacement: number

  @Column('integer')
  damageDone: number

  @Column('integer')
  damageTaken: number

  @Column('integer')
  kills: number

  @Column('integer')
  deaths: number

  @Column('integer')
  suicides: number

  @Column('integer')
  assists: number

  @Column('integer')
  executions: number

  @Column('integer')
  headshots: number

  @Column('integer')
  shotsHit: number

  @Column('integer')
  shotsMiss: number

  @Column('integer')
  wallBangs: number

  @Column('integer')
  nearMisses: number

  @Column('integer')
  longestStreak: number

  @Column('numeric')
  distanceTraveled: number

  @Column('numeric')
  percentTimeMoving: number

  @Column('numeric')
  avgSpeed: number

  @Column('integer')
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

  @Column('jsonb')
  weapons: { [key:string]: Weapon }

  @Column('jsonb')
  killstreaks: { [key:string]: Killstreak }

  @Column('jsonb')
  objectives: Objectives

  @Column('jsonb', { array: true })
  loadouts: Loadout[]

  @Column('timestamp')
  created: Date
}

@Injectable()
export class MwMpMatchRecordDAO {
  constructor(
    @InjectRepository(MwMpMatchRecord) private matchRecordRepo: Repository<MwMpMatchRecord>,
  ) {}
  private normalizeModel(match:Partial<MwMpMatchRecord>) {
    return {
      ...match,
      weapons: () => `'${JSON.stringify(match.weapons)}'::jsonb`,
      killstreaks: () => `'${JSON.stringify(match.killstreaks)}'::jsonb`,
      objectives: () => `'{}'::jsonb`,
      loadouts: () => `array[]::jsonb[]`,
    }
  }
  public async insert(match:Partial<MwMpMatchRecord>):Promise<InsertResult> {
    return this.matchRecordRepo.createQueryBuilder()
      .insert()
      .into(MwMpMatchRecord)
      .values(this.normalizeModel(match))
      .execute()
  }
  public async update(match:Partial<MwMpMatchRecord>):Promise<UpdateResult> {
    return this.matchRecordRepo.createQueryBuilder()
      .update()
      .set(this.normalizeModel(match))
      .where({ matchId: match.matchId, accountId: match.accountId })
      .execute()
  }
  public async findById(matchId:string):Promise<MwMpMatchRecord> {
      const match = await this.matchRecordRepo.findOne(matchId)
      return Postgres.Denormalize.Model<MwMpMatchRecord>(match)
  }
}

/************************************************************************************************************
 * Modern Warfare - Warzone - Match Details
 ***********************************************************************************************************/
@Entity({ name: 'mw/wz/match/details' })
export class MwWzMatchDetails {
  @PrimaryColumn()
  @Index({ unique: true })
  matchId: string

  @Column('citext')
  modeId: Schema.API.MW.Match.Mode

  @Column('citext')
  mapId: Schema.API.MW.Map

  @Column('integer')
  startTime: number

  @Column('integer')
  endTime: number

  @Column('timestamp')
  created: Date
}
@Injectable()
export class MwWzMatchDetailsDAO {
  constructor(
    @InjectRepository(MwWzMatchDetails) private matchDetailsRepo: Repository<MwWzMatchDetails>,
  ) {}
  private normalizeModel(match:MwWzMatchDetails) {
    return { ...match }
  }
  public async insert(match:MwWzMatchDetails):Promise<InsertResult> {
    return this.matchDetailsRepo.createQueryBuilder()
      .insert()
      .into(MwWzMatchDetails)
      .values(this.normalizeModel(match))
      .execute()
  }
  public async update(match:MwWzMatchDetails):Promise<UpdateResult> {
    return this.matchDetailsRepo.createQueryBuilder()
      .update()
      .set(this.normalizeModel(match))
      .where({ matchId: match.matchId })
      .execute()
  }
  public async findById(matchId:string):Promise<MwWzMatchDetails> {
      const match = await this.matchDetailsRepo.findOne(matchId)
      return Postgres.Denormalize.Model<MwWzMatchDetails>(match)
  }
}
/************************************************************************************************************
 * Modern Warfare - Warzone - Match Record
 ***********************************************************************************************************/
@Entity({ name: 'mw/wz/match/records' })
export class MwWzMatchRecord {
  @PrimaryColumn('uuid')
  @Index({ unique: true })
  id: string

  @Column('uuid')
  accountId: string

  @Column('text')
  matchId: string

  @Column('citext')
  modeId: Schema.API.MW.Match.Mode

  @Column('citext')
  mapId: Schema.API.MW.Map

  @Column('citext')
  teamId: string

  @Column('citext')
  unoId: string

  @Column('citext')
  username: string

  @Column('citext')
  clantag: string

  @Column('integer')
  score: number

  @Column('numeric')
  timePlayed: number

  @Column('numeric')
  avgLifeTime: number

  @Column('integer')
  teamPlacement: number

  @Column('integer')
  teamSurvivalTime: number

  @Column('integer')
  damageDone: number

  @Column('integer')
  damageTaken: number

  @Column('integer')
  kills: number

  @Column('integer')
  deaths: number

  @Column('integer', { array: true })
  downs: number[]

  @Column('integer')
  eliminations: number

  @Column('integer')
  teamWipes: number

  @Column('integer')
  executions: number

  @Column('integer')
  headshots: number

  @Column('integer')
  revives: number

  @Column('integer')
  contracts: number

  @Column('integer')
  lootCrates: number

  @Column('integer')
  buyStations: number

  @Column('integer')
  gulagKills: number

  @Column('integer')
  gulagDeaths: number

  @Column('integer')
  clusterKills: number

  @Column('integer')
  airstrikeKills: number

  @Column('integer')
  longestStreak: number

  @Column('numeric')
  distanceTraveled: number

  @Column('numeric')
  percentTimeMoving: number

  @Column('integer')
  equipmentDestroyed: number

  @Column('integer')
  trophyDefense: number

  @Column('integer')
  munitionShares: number

  @Column('integer')
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

  @Column('jsonb', { array: true })
  loadouts: Loadout[]

  @Column('timestamp')
  created: Date
}

@Injectable()
export class MwWzMatchRecordDAO {
  constructor(
    @InjectRepository(MwWzMatchRecord) private matchRecordRepo: Repository<MwWzMatchRecord>,
  ) {}
  private normalizeModel(match:Partial<MwWzMatchRecord>) {
    return {
      ...match,

    }
  }
  public async insert(match:Partial<MwWzMatchRecord>):Promise<InsertResult> {
    return this.matchRecordRepo.createQueryBuilder()
      .insert()
      .into(MwWzMatchRecord)
      .values(this.normalizeModel(match))
      .execute()
  }
  public async update(match:MwWzMatchRecord):Promise<UpdateResult> {
    return this.matchRecordRepo.createQueryBuilder()
      .update()
      .set(this.normalizeModel(match))
      .where({ matchId: match.matchId, accountId: match.accountId })
      .execute()
  }
  public async findById(matchId:string):Promise<MwWzMatchRecord> {
      const match = await this.matchRecordRepo.findOne(matchId)
      return Postgres.Denormalize.Model<MwWzMatchRecord>(match)
  }
}
