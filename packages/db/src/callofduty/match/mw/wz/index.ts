import { Detail as DetailEntity, DetailRepository } from './detail'
import { Loadout as LoadoutEntity, LoadoutRepository } from './loadout'
import { Objective as ObjectiveEntity, ObjectiveRepository } from './objective'
import { Stats as StatsEntity, StatsRepository } from './stats'

export const Detail = {
    Entity: DetailEntity,
    Repository: DetailRepository
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