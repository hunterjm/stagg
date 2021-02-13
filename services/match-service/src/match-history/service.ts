import { Schema } from 'callofduty'
import { CallOfDuty } from '@stagg/db'
import { FindConditions, getCustomRepository } from 'typeorm'
import { Filter, MatchParameters } from './parameters'
import { Equal, LessThan, MoreThan, In, Not } from 'typeorm'

const Operators = {
    eq: Equal,
    neq: Not,
    lt: LessThan,
    gt: MoreThan,
    in: In,
}

export class MatchHistoryService {
    private readonly MwMpMatchStatsRepo: CallOfDuty.Match.MW.MP.Stats.Repository
    private readonly MwMpMatchKillstreakRepo: CallOfDuty.Match.MW.MP.Killstreak.Repository
    private readonly MwMpMatchLoadoutRepo: CallOfDuty.Match.MW.MP.Loadout.Repository
    private readonly MwMpMatchObjectiveRepo: CallOfDuty.Match.MW.MP.Objective.Repository
    private readonly MwMpMatchWeaponRepo: CallOfDuty.Match.MW.MP.Weapon.Repository
    private readonly MwWzMatchStatsRepo: CallOfDuty.Match.MW.WZ.Stats.Repository
    private readonly MwWzMatchLoadoutRepo: CallOfDuty.Match.MW.WZ.Loadout.Repository
    private readonly MwWzMatchObjectiveRepo: CallOfDuty.Match.MW.WZ.Objective.Repository
    private readonly AccountRepo: CallOfDuty.Account.Base.Repository
    constructor() {
        this.MwMpMatchStatsRepo = getCustomRepository(CallOfDuty.Match.MW.MP.Stats.Repository)
        this.MwMpMatchKillstreakRepo = getCustomRepository(CallOfDuty.Match.MW.MP.Killstreak.Repository)
        this.MwMpMatchLoadoutRepo = getCustomRepository(CallOfDuty.Match.MW.MP.Loadout.Repository)
        this.MwMpMatchObjectiveRepo = getCustomRepository(CallOfDuty.Match.MW.MP.Objective.Repository)
        this.MwMpMatchWeaponRepo = getCustomRepository(CallOfDuty.Match.MW.MP.Weapon.Repository)
        this.MwWzMatchStatsRepo = getCustomRepository(CallOfDuty.Match.MW.WZ.Stats.Repository)
        this.MwWzMatchLoadoutRepo = getCustomRepository(CallOfDuty.Match.MW.WZ.Loadout.Repository)
        this.MwWzMatchObjectiveRepo = getCustomRepository(CallOfDuty.Match.MW.WZ.Objective.Repository)
        this.AccountRepo = getCustomRepository(CallOfDuty.Account.Base.Repository)
    }
    private getResource(gameId: Schema.Game, gameType: Schema.GameType) {
        const gameKey = gameId.toLowerCase()
        const gameTypeKey = gameType.toLowerCase()
        const resources = {
            'mw/mp': {
                stats: this.MwMpMatchStatsRepo,
                weapons: this.MwMpMatchWeaponRepo, // TODO: add to gql
                killstreaks: this.MwMpMatchKillstreakRepo,
                loadouts: this.MwMpMatchLoadoutRepo,
                objectives: this.MwMpMatchObjectiveRepo,
            },
            'mw/wz': {
                stats: this.MwWzMatchStatsRepo,
                loadouts: this.MwWzMatchLoadoutRepo,
                objectives: this.MwWzMatchObjectiveRepo,
            }
        }
        const resourceKey = `${gameKey}/${gameTypeKey}`
        if (!resources[resourceKey]) {
            throw `unsupported game/mode "${gameId}"/"${gameType}"`
        }
        return resources[resourceKey]
    }
    private buildWhereFromFilters = (filter?: Filter): FindConditions<any> => {
        if (!filter) return {}
        const where: FindConditions<any> = {}
        Object.entries(filter).forEach(([key, value]) => {
            const [field, operator] = key.split('_', 2)
            const typeormOperator = Operators[operator]
            if (!typeormOperator) {
                throw `operator on field ${key} not supported`
            }
            where[field] = typeormOperator(value)
        })
        return where
    }
    public async getHistoryByAccountId(parameters:MatchParameters) {
        const account = await this.AccountRepo.findOneOrFail(parameters.accountId)
        const resource = this.getResource(parameters.gameId, parameters.gameType)
        const where = this.buildWhereFromFilters(parameters.filter)
        return await resource.stats.findByAccountId(account.accountId, where, parameters.limit, parameters.offset)
    }
    public async getLoadoutsByMatch(parameters: MatchParameters, matchId: string) {
        const resource = this.getResource(parameters.gameId, parameters.gameType)
        return await resource.loadouts.findLoadouts(matchId, parameters.accountId)
    }
    public async getObjectivesByMatch(parameters: MatchParameters, matchId: string) {
        const resource = this.getResource(parameters.gameId, parameters.gameType)
        return await resource.objectives.findObjectives(matchId, parameters.accountId)
    }
    public async getKillstreaksByMatch(parameters: MatchParameters, matchId: string) {
        const resource = this.getResource(parameters.gameId, parameters.gameType)
        return await resource.killstreaks.findKillsreaks(matchId, parameters.accountId)
    }
    public async getWeaponsByMatch(parameters: MatchParameters, matchId: string) {
        const resource = this.getResource(parameters.gameId, parameters.gameType)
        return await resource.weapons.findWeapons(matchId, parameters.accountId)
    }
}
