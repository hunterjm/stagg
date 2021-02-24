import * as DB from '@stagg/db'
import { getCustomRepository } from 'typeorm'


export class DbService {
    private readonly wzRepo:DB.CallOfDuty.WZ.Match.Repository = getCustomRepository(DB.CallOfDuty.WZ.Match.Repository)
    private readonly susRepo:DB.CallOfDuty.WZ.Suspect.Repository = getCustomRepository(DB.CallOfDuty.WZ.Suspect.Repository)
    constructor() {}
    public async saveSuspect(sus:DB.CallOfDuty.WZ.Suspect.Entity):Promise<DB.CallOfDuty.WZ.Suspect.Entity> {
        return this.susRepo.save(sus)
    }
    public async matchAlreadyInvestigated(match_id:string):Promise<Boolean> {
        const exists = await this.wzRepo.findAll({ match_id })
        return Boolean(exists.length > 1)
    }
    
}

