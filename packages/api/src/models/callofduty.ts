import * as CallOfDuty from '@callofduty/types'

interface GenericProfile {
    updated: Date
    level: number
    prestige: number
    levelXpGained: number
    levelXpRemainder: number
    currentWinStreak: number
    lifetime: {
        xp: number
        wins: number
        score: number
        draws: number
        games: number
        kills: number
        deaths: number
        assists: number
        suicides: number
        headshots: number
        timePlayed: number
        shots: {
            hit: number
            miss: number
        }
    }
    record: {
        xp: number
        spm: number
        kdr: number
        score: number
        kills: number
        deaths: number
        assists: number
        winStreak: number
        killStreak: number
    }
}

export namespace MW {
    export interface Profile extends GenericProfile {
        modes: Record<string, MW.Profile.Mode>
        weapons?: Record<string, MW.Profile.Weapon>
        equipment?: Record<string, MW.Profile.Equipment>
    }
    export namespace Profile {
        export interface Mode {
            modeId: CallOfDuty.MW.Mode.MP
            score: number
            kills: number
            deaths: number
            timePlayed: number
        }
        export interface Weapon {
            weaponId: CallOfDuty.MW.Weapon.Name
            kills: number
            deaths: number
            headshots: number
            shots: {
                hit: number
                miss: number
            }
        }
        export interface Equipment {
            equipmentId: string
            equipmentType: 'tactical' | 'lethal'
            uses: number
            hits?: number
            kills?: number
        }
    }
}
export namespace WZ {
    export interface Profile extends GenericProfile {
        modes: Record<string, WZ.Profile.Mode>
        weapons?: Record<string, MW.Profile.Weapon>
        equipment?: Record<string, MW.Profile.Equipment>
    }
    export namespace Profile {
        export interface Mode {
            modeId: CallOfDuty.MW.Mode.WZ
            score: number
            kills: number
            deaths: number
            timePlayed: number
            wins: number
            games: number
            top5: number
            top10: number
            top25: number
            downs: number
            contracts: number
            revives: number
            cash: number
        }
    }
}
