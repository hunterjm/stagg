import { Schema, Assets } from 'callofduty'
import { Controller, Get, Param, NotFoundException } from '@nestjs/common'

@Controller('callofduty/assets/mw')
export class CallOfDutyAssetsController {
    constructor() {}

    @Get('maps/:mapId')
    async MapDetails(@Param() { mapId }:{mapId:Schema.MW.Map}) {
        const map = Assets.MW.Map(mapId)
        if (!map) {
            throw new NotFoundException('map not found')
        }
        return map
    }

    @Get('modes/:modeId')
    async ModeDetails(@Param() { modeId }:{modeId:Schema.MW.Mode}) {
        const mode = Assets.MW.Mode(modeId)
        if (!mode) {
            throw new NotFoundException('mode not found')
        }
        return mode
    }

    @Get('weapons/:weaponId')
    async WeaponDetails(@Param() { weaponId }:{weaponId:Schema.MW.Loadout.Weapon.Name}) {
        const weapon = Assets.MW.Weapon(weaponId)
        if (!weapon) {
            throw new NotFoundException('weapon not found')
        }
        return weapon
    }

    @Get('killstreaks/:killstreakId')
    async KillstreakDetails(@Param() { killstreakId }:{killstreakId:Schema.MW.Killstreak.Name}) {
        const killstreak = Assets.MW.Killstreak(killstreakId)
        if (!killstreak) {
            throw new NotFoundException('killstreak not found')
        }
        return killstreak
    }
}
