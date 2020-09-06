import { Response } from 'express'
import { Controller, Get, Res, Query } from '@nestjs/common'
import { CallOfDutyDataService } from './services'

@Controller('data')
export class CallOfDutyDataController {
    constructor(private readonly service: CallOfDutyDataService) {}

    @Get('callofduty/:title/:mode/:platform/:identifier')
    async DownloadPerformances(@Res() res: Response, @Query() query:any):Promise<void> {
        if (query.filter) {
            const filter = JSON.parse(query.filter)
            res.send(filter)
        }
        res.send(await this.service.MatchIds())
    }
}

// const mongo = await Mongo.client('callofduty')
// const { username, platform } = req.query
// const player = await mongo.collection('accounts').findOne(Mongo.Queries.CallOfDuty.Account.Find(username, platform))
// if (!player) return res.status(404).send({ error: 'player not found' })
// mongo.collection('mw.wz.performances').find({ 'player._id': player._id }).pipe(JSONStream.stringify()).pipe(res)

