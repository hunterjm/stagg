import * as DB from '@stagg/db'
import * as Events from '@stagg/events'
import { getCustomRepository, In } from 'typeorm'
import * as CallOfDuty from '@callofduty/types'
import {
    normalizeWzMatch,
    normalizeMwMatch,
    normalizeMwProfile,
    normalizeUnoFriend,
    normalizeConsoleFriend,
    normalizeMwProfileModes,
    normalizeWzProfileModes,
    normalizeMwProfileEquipment,
    normalizeMwProfileWeapons,
    normalizeWzLoadout,
} from './normalize'

export class DbService {
    private readonly acctRepo:DB.Account.Repository = getCustomRepository(DB.Account.Repository)
    private readonly friendRepo:DB.CallOfDuty.Friend.Repository = getCustomRepository(DB.CallOfDuty.Friend.Repository)
    private readonly mwMatchRepo:DB.CallOfDuty.MW.Match.Repository = getCustomRepository(DB.CallOfDuty.MW.Match.Repository)
    private readonly wzMatchRepo:DB.CallOfDuty.WZ.Match.Repository = getCustomRepository(DB.CallOfDuty.WZ.Match.Repository)
    private readonly wzLoadoutRepo:DB.CallOfDuty.WZ.Loadout.Repository = getCustomRepository(DB.CallOfDuty.WZ.Loadout.Repository)
    private readonly mwProfileRepo:DB.CallOfDuty.MW.Profile.Repository = getCustomRepository(DB.CallOfDuty.MW.Profile.Repository)
    private readonly mwProfileModeRepo:DB.CallOfDuty.MW.Profile.Mode.Repository = getCustomRepository(DB.CallOfDuty.MW.Profile.Mode.Repository)
    private readonly wzProfileModeRepo:DB.CallOfDuty.WZ.Profile.Mode.Repository = getCustomRepository(DB.CallOfDuty.WZ.Profile.Mode.Repository)
    private readonly mwProfileWeaponsRepo:DB.CallOfDuty.MW.Profile.Weapon.Repository = getCustomRepository(DB.CallOfDuty.MW.Profile.Weapon.Repository)
    private readonly mwProfileEquipmentRepo:DB.CallOfDuty.MW.Profile.Equipment.Repository = getCustomRepository(DB.CallOfDuty.MW.Profile.Equipment.Repository)
    constructor() {}
    public async getAccount(account_id:string):Promise<DB.Account.Entity> {
        return this.acctRepo.findOne({ account_id })
    }
    public async saveAccount(account:DB.Account.Entity):Promise<DB.Account.Entity> {
        return this.acctRepo.save(account)
    }
    public async saveFriend(friend:DB.CallOfDuty.Friend.Entity):Promise<DB.CallOfDuty.Friend.Entity> {
        return this.friendRepo.save(friend)
    }
    public async pruneFriends(account_id:string, valid_friend_uno_ids:string[]) {
        return this.friendRepo.prune(account_id, valid_friend_uno_ids)
    }
    public async getMwMatchRecord(account_id:string, match_ids:string[]):Promise<DB.CallOfDuty.MW.Match.Entity[]> {
        return this.mwMatchRepo.findAll({ account_id, match_id: In(match_ids) } as any)
    }
    public async saveMwMatch(match:DB.CallOfDuty.MW.Match.Entity):Promise<DB.CallOfDuty.MW.Match.Entity> {
        return this.mwMatchRepo.save(match)
    }
    public async getWzMatchIds(account_id:string, match_ids:string[]):Promise<DB.CallOfDuty.WZ.Match.Entity[]> {
        return this.wzMatchRepo.query().select('match_id').where({ account_id, match_id: In(match_ids) }).execute()
    }
    public async getWzMatchIdsByAny(match_ids:string[]):Promise<DB.CallOfDuty.WZ.Match.Entity[]> {
        return this.wzMatchRepo.query().select('match_id').where({ match_id: In(match_ids) }).execute()
    }
    public async saveWzMatch(match:DB.CallOfDuty.WZ.Match.Entity):Promise<DB.CallOfDuty.WZ.Match.Entity> {
        return this.wzMatchRepo.save(match)
    }
    public async saveWzLoadout(loadout:DB.CallOfDuty.WZ.Loadout.Entity):Promise<DB.CallOfDuty.WZ.Loadout.Entity> {
        return this.wzLoadoutRepo.save(loadout)
    }
    public async saveMwProfile(profile:DB.CallOfDuty.MW.Profile.Entity):Promise<DB.CallOfDuty.MW.Profile.Entity> {
        return this.mwProfileRepo.save(profile)
    }
    public async saveMwProfileMode(mode:DB.CallOfDuty.MW.Profile.Mode.Entity):Promise<DB.CallOfDuty.MW.Profile.Mode.Entity> {
        return this.mwProfileModeRepo.save(mode)
    }
    public async saveWzProfileMode(mode:DB.CallOfDuty.WZ.Profile.Mode.Entity):Promise<DB.CallOfDuty.WZ.Profile.Mode.Entity> {
        return this.wzProfileModeRepo.save(mode)
    }
    public async saveMwProfileWeapon(weapon:DB.CallOfDuty.MW.Profile.Weapon.Entity):Promise<DB.CallOfDuty.MW.Profile.Weapon.Entity> {
        return this.mwProfileWeaponsRepo.save(weapon)
    }
    public async saveMwProfileEquipment(equipment:DB.CallOfDuty.MW.Profile.Equipment.Entity):Promise<DB.CallOfDuty.MW.Profile.Equipment.Entity> {
        return this.mwProfileEquipmentRepo.save(equipment)
    }
}

export class ScraperService {
    private readonly dbService = new DbService()
    constructor(
        private account:DB.Account.Entity,
        private readonly redundancy:boolean = false,
    ) {}
    public async refreshUpdatedDateTime() {
        this.account.updated_datetime = new Date()
        await this.dbService.saveAccount(this.account)
    }
    public async savePlatformIds(apiIdentityRes:CallOfDuty.Routes.Accounts) {
        // Update profiles if applicable
        this.account.callofduty_uno_username = apiIdentityRes.uno?.username
        this.account.callofduty_xbl_username = apiIdentityRes.xbl?.username
        this.account.callofduty_psn_username = apiIdentityRes.psn?.username
        this.account.callofduty_battle_username = apiIdentityRes.battle?.username
        this.account = await this.dbService.saveAccount(this.account)
    }
    public async saveFriendsList(apiFriendsRes:CallOfDuty.Routes.Friends) {
        const formattedFriends:DB.CallOfDuty.Friend.Entity[] = []
        if (apiFriendsRes?.uno) {
            for(const friend of apiFriendsRes.uno) {
                formattedFriends.push(normalizeUnoFriend(this.account.account_id, friend))
            }
        }
        if (apiFriendsRes?.firstParty?.xbl) {
            for(const friend of apiFriendsRes.firstParty.xbl) {
                formattedFriends.push(normalizeConsoleFriend(this.account.account_id, 'xbl', friend))
            }
        }
        if (apiFriendsRes?.firstParty?.psn) {
            for(const friend of apiFriendsRes.firstParty.psn) {
                formattedFriends.push(normalizeConsoleFriend(this.account.account_id, 'psn', friend))
            }
        }
        const filteredFriends = formattedFriends.filter(f => f.friend_uno_id)
        for(const friend of filteredFriends) {
            if (!friend.friend_uno_id) {
                continue // will be missing for platform friends that don't have cod, ignore
            }
            await this.dbService.saveFriend(friend)
        }
        await this.dbService.pruneFriends(this.account.account_id, filteredFriends.map(f => f.friend_uno_id))
    }
    public async saveMwProfileData(apiProfileRes:CallOfDuty.MW.Profile) {
        const profile = normalizeMwProfile(this.account.account_id, apiProfileRes)
        await this.dbService.saveMwProfile(profile)
        const mpProfileModes = normalizeMwProfileModes(this.account.account_id, apiProfileRes)
        for(const mode of mpProfileModes) {
            await this.dbService.saveMwProfileMode(mode)
        }
        const wzProfileModes = normalizeWzProfileModes(this.account.account_id, apiProfileRes)
        for(const mode of wzProfileModes) {
            await this.dbService.saveWzProfileMode(mode)
        }
        const profileWeapons = normalizeMwProfileWeapons(this.account.account_id, apiProfileRes)
        for(const weapon of profileWeapons) {
            await this.dbService.saveMwProfileWeapon(weapon)
        }
        const profileEquipment = normalizeMwProfileEquipment(this.account.account_id, apiProfileRes)
        for(const equipment of profileEquipment) {
            await this.dbService.saveMwProfileEquipment(equipment)
        }
    }
    public async saveMwMatchHistory(apiMatchRes:CallOfDuty.Routes.MatchHistory, startTime:number=0):Promise<number> {
        if (!apiMatchRes.matches?.length) {
            return -1
        }
        if (!this.redundancy) {
            const matchIds = apiMatchRes.matches.map(m => m.matchID)
            const existing = await this.dbService.getMwMatchRecord(this.account.account_id, matchIds)
            if (existing.length === matchIds.length) {
                console.log('[*] Redundant MW Match History found; stopping search...')
                return -1
            }
        }
        const originalStartTime = startTime
        for(const match of apiMatchRes.matches as CallOfDuty.MW.Match.MP[]) {
            startTime = this.updateStartTime(startTime, match.utcStartSeconds)
            const normalizedMatch = normalizeMwMatch(this.account.account_id, match)
            try { await this.dbService.saveMwMatch(normalizedMatch) } catch(e) { console.log('[!] MW Match Failure', e) }
        }
        return startTime === originalStartTime ? -1 : startTime
    }
    public async saveWzMatchHistory(apiMatchRes:CallOfDuty.Routes.MatchHistory, startTime:number=0):Promise<number> {
        if (!apiMatchRes.matches?.length) {
            return -1
        }
        const matchIds = apiMatchRes.matches.map(m => m.matchID)
        const existing = await this.dbService.getWzMatchIds(this.account.account_id, matchIds)
        const existingMatchIds = existing.map(e => e.match_id)
        if (existing.length === matchIds.length) {
            console.log('[*] Redundant WZ Match History found; stopping search...')
            return -1
        }
        if (!this.redundancy && existing.length === matchIds.length) {
            console.log('[*] Redundant WZ Match History found; stopping search...')
            return -1
        }
        const originalStartTime = startTime
        const prediscovered = await this.dbService.getWzMatchIdsByAny(matchIds)
        const prediscoveredMatchIds = prediscovered.map(e => e.match_id)
        const discoveredMatchIds = matchIds.filter(id => !prediscoveredMatchIds.includes(id))
        for(const match of apiMatchRes.matches as CallOfDuty.MW.Match.WZ[]) {
            startTime = this.updateStartTime(startTime, match.utcStartSeconds)
            const normalizedMatch = normalizeWzMatch(this.account.account_id, match)
            try {
                const match = await this.dbService.saveWzMatch(normalizedMatch)
                Events.CallOfDuty.WZ.Match.Created.Trigger({ account: this.account, match })
                if (discoveredMatchIds.includes(match.match_id)) {
                    Events.CallOfDuty.WZ.Match.Discovered.Trigger({ account: this.account, match })
                }
            } catch(e) { console.log('[!] WZ Match Failure', e) }
            for(const index in match.player.loadout) {
                const normalized = normalizeWzLoadout(this.account.account_id, match.matchID, Number(index), match.player.loadout[index])
                try { await this.dbService.saveWzLoadout(normalized) } catch(e) { console.log('[!] WZ Loadout Failure', e) }
            }
        }
        return startTime === originalStartTime ? -1 : startTime
    }
    private updateStartTime(currentStartTime:number, currentMatchStartTime:number):number {
        let finalStartTime = currentStartTime
        const normalizedStartTime = (currentMatchStartTime - 5) * 1000
        if (!finalStartTime || finalStartTime > normalizedStartTime) {
            finalStartTime = normalizedStartTime
        }
        return finalStartTime
    }
}

