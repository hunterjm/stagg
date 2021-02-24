import * as DB from '@stagg/db'
import { getCustomRepository, LessThan, LessThanOrEqual, MoreThanOrEqual } from 'typeorm'
import { config } from './config'

export class Service {
    constructor(
        private readonly acctRepo:DB.Account.Repository = getCustomRepository(DB.Account.Repository)
    ) {}
    async getAccounts():Promise<DB.Account.Entity[]> {
        const premiumThreshold = new Date()
        const standardThreshold = new Date()
        premiumThreshold.setTime(premiumThreshold.getTime() - config.network.timing.faas.etl.account.interval.premium * 1000)
        standardThreshold.setTime(standardThreshold.getTime() - config.network.timing.faas.etl.account.interval.standard * 60 * 1000)
        console.log('[?] Pulling premium accounts with an updated datetime <= ', premiumThreshold)
        console.log('[?] Pulling standard accounts with an updated datetime <= ', standardThreshold)
        const premiumAccts = await this.acctRepo.findAll({
            subscription_expiration_datetime: MoreThanOrEqual(new Date()),
            updated_datetime: LessThanOrEqual(premiumThreshold),
        } as any)
        const standardAccts = await this.acctRepo.findAll({
            subscription_expiration_datetime: LessThan(new Date()),
            updated_datetime: LessThanOrEqual(standardThreshold),
        } as any)
        return [...premiumAccts, ...standardAccts]
    }
}

