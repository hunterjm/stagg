import { Schema } from '@stagg/callofduty'
import { IsNotEmpty } from 'class-validator'

export class CallOfDutyMatchDetailsDTO {
    @IsNotEmpty()
    matchId: string

    @IsNotEmpty()
    modeId: Schema.API.MW.Match.Mode

    @IsNotEmpty()
    mapId: Schema.API.MW.Map

    @IsNotEmpty()
    startTime: number

    @IsNotEmpty()
    endTime: number
}

export class CallOfDutyMatchRecordDTO {
    @IsNotEmpty()
    unoId: string

    @IsNotEmpty()
    matchId: string

    @IsNotEmpty()
    modeId: Schema.API.MW.Match.Mode

    @IsNotEmpty()
    mapId: Schema.API.MW.Map

    @IsNotEmpty()
    startTime: number

    @IsNotEmpty()
    endTime: number
}
