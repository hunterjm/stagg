import {
    Controller,
    Put,
    Param,
} from '@nestjs/common'

@Controller('callofduty/profile')
export class CallOfDutyProfileController {
    constructor(
    ) {}

    @Put('/:gameId/:gameType/:unoId')
    async SaveProfileDataByUnoId(@Param() { unoId, gameId, gameType }):Promise<{ success: boolean }> {
        
        return { success: true }
    }

    @Put('/:gameId/:gameType/:platform/:username')
    async SaveProfileDataByProfileId(@Param() { gameId, platform, username }):Promise<{ success: boolean }> {
        
        return { success: true }
    }
}