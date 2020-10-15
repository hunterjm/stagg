import { Schema } from '@stagg/callofduty'
import {
    Controller,
    Put,
    Param,
} from '@nestjs/common'

@Controller('callofduty/friends')
export class CallOfDutyFriendsController {
    constructor(
    ) {}

    @Put('/:gameId/:platform/:username')
    async SaveFriendsForProfileId(@Param() { gameId, platform, username }):Promise<{ success: boolean }> {
        
        return { success: true }
    }
}