import { Schema, Normalize } from '@stagg/callofduty'
import { Controller, Get, Param, NotFoundException } from '@nestjs/common'

@Controller('callofduty/mw')
export class ModernWarfareController {
    constructor() {}

    @Get('maps/:mapId')
    async MapDetails(@Param() { mapId }:{mapId:Schema.API.MW.Map}):Promise<Schema.Map> {
        const map = Normalize.MW.Map(mapId)
        if (!map) {
            throw new NotFoundException('map not found')
        }
        return map
    }

    @Get('modes/:modeId')
    async ModeDetails(@Param() { modeId }:{modeId:Schema.API.MW.Match.Mode}):Promise<Schema.Mode> {
        const mode = Normalize.MW.Mode(modeId)
        if (!mode) {
            throw new NotFoundException('mode not found')
        }
        return mode
    }

    @Get('weapons/:weaponId')
    async WeaponDetails(@Param() { weaponId }:{weaponId:Schema.API.MW.Loadout.Weapon.Name}):Promise<Schema.Weapon> {
        const weapon = Normalize.MW.Weapon(weaponId)
        if (!weapon) {
            throw new NotFoundException('weapon not found')
        }
        return weapon
    }

    @Get('killstreaks/:killstreakId')
    async KillstreakDetails(@Param() { killstreakId }:{killstreakId:Schema.API.MW.Killstreak.Name}):Promise<Schema.Killstreak> {
        const killstreak = Normalize.MW.Killstreak(killstreakId)
        if (!killstreak) {
            throw new NotFoundException('killstreak not found')
        }
        return killstreak
    }
}
