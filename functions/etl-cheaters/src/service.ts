import * as DB from '@stagg/db'
import { getCustomRepository } from 'typeorm'


export class DbService {
    private readonly susRepo:DB.CallOfDuty.Sus.Repository = getCustomRepository(DB.CallOfDuty.Sus.Repository)
    private readonly invRepo:DB.CallOfDuty.Sus.Match.Repository = getCustomRepository(DB.CallOfDuty.Sus.Match.Repository)
    constructor() {}
    public async saveSuspect(sus:DB.CallOfDuty.Sus.Entity):Promise<DB.CallOfDuty.Sus.Entity> {
        return this.susRepo.save(sus)
    }
    public async saveMatchInvesgitation(match_id:string):Promise<DB.CallOfDuty.Sus.Match.Entity> {
        return this.invRepo.save({ match_id })
    }
    public async getMatchInvesgitation(match_id:string):Promise<DB.CallOfDuty.Sus.Match.Entity> {
        return this.invRepo.findOne({ match_id })
    }
    
}

