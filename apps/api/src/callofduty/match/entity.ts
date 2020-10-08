import { Schema } from '@stagg/callofduty'
import { Entity, Column, PrimaryColumn, Index } from 'typeorm'

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

export namespace MW {
  export namespace MP {
    @Entity({ name: 'mw/mp/match/details' })
    export class Details {
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
    @Entity({ name: 'mw/mp/match/records' })
    export class Record {
      @PrimaryColumn()
      @Index({ unique: true })
      recordId: string
    
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
  }
  export namespace WZ {
    @Entity({ name: 'mw/wz/match/details' })
    export class Details {
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
    @Entity({ name: 'mw/wz/match/records' })
    export class Record {
      @PrimaryColumn()
      @Index({ unique: true })
      recordId: string
    
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
  }
}
