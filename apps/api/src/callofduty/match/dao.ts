import { Schema } from '@stagg/callofduty'
import { InsertResult, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Injectable } from '@nestjs/common'
import * as Match from 'src/callofduty/match/entity'
import { Postgres } from 'src/util'

export namespace MW {
  export namespace MP {

  }
}

@Injectable()
export class MatchDAO {
  constructor(
    @InjectRepository(Match.MW.MP.Details) private mw_mp_details: Repository<Match.MW.MP.Details>,
    @InjectRepository(Match.MW.MP.Record)  private mw_mp_records: Repository<Match.MW.MP.Record>,
    @InjectRepository(Match.MW.WZ.Details) private mw_wz_details: Repository<Match.MW.WZ.Details>,
    @InjectRepository(Match.MW.WZ.Record)  private mw_wz_records: Repository<Match.MW.WZ.Record>,
  ) {}
  public async insert(unoId:string, { atkn, xsrf, sso }:Schema.API.Tokens, access:'public'='public'):Promise<InsertResult> {
    return null
    // return this.acctRepository.createQueryBuilder()
    // .insert()
    // .into(Account)
    // .values({
    //   unoId,
    //   access,
    //   auth: () => `array['{"sso":"${sso}","xsrf":"${xsrf}","atkn":"${atkn}"}'::jsonb]`,
    // }).execute()
  }
  public async findByUnoId(unoId:string):Promise<Account> {
    return null
      // const acct = await this.acctRepository.findOne(unoId)
      // if (!acct) {
      //     throw `Account missing for ${unoId}`
      // }
      // return Postgres.Denormalize.Model<Account>(acct)
  }
}
