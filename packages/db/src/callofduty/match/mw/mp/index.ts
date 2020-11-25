import { Detail as DetailEntity, DetailRepository } from './detail'
import { Killstreak as KillstreakEntity, KillstreakRepository } from './killstreak'
import { Loadout as LoadoutEntity, LoadoutRepository } from './loadout'
import { Objective as ObjectiveEntity, ObjectiveRepository } from './objective'
import { Stats as StatsEntity, StatsRepository } from './stats'
import { Weapon as WeaponEntity, WeaponRepository } from './weapon'

export const Detail = {
    Entity: DetailEntity,
    Repository: DetailRepository
}

export const Killstreak = {
    Entity: KillstreakEntity,
    Repository: KillstreakRepository
}

export const Loadout = {
    Entity: LoadoutEntity,
    Repository: LoadoutRepository
}

export const Objective = {
    Entity: ObjectiveEntity,
    Repository: ObjectiveRepository
}

export const Stats = {
    Entity: StatsEntity,
    Repository: StatsRepository
}

export const Weapon = {
    Entity: WeaponEntity,
    Repository: WeaponRepository
}