import 'mobx-react-lite/batchingForReactDom'
import { observable } from 'mobx'
import { createContext } from 'react'
import { Types } from './index'

export class Instance {
    @observable private _profiles:Types.Profile[] = []
    get profiles() { return [...this._profiles.map((p:Types.Profile) => ({...p, key: `${p.mode}:${p.platform}:${p.username}`}))] }
    addProfile(profile:Types.Profile) {
        if (!this._profiles.find(p => p.mode === profile.mode && p.platform === profile.platform && p.username === profile.username)) {
            this._profiles.push(profile)
        }
    }
    removeProfile({ mode, platform, username }:Types.Profile) {
        this._profiles = this._profiles
            .filter((p:Types.Profile) => !(p.mode === mode && p.platform === platform && p.username === username))
    }
    setProfileSyncDetails({ mode, platform, username }:Types.Profile, syncDetails:Partial<Types.Profile.Sync>) {
        const profile = this._profiles.find((p:Types.Profile) => p.mode === mode && p.platform === platform && p.username === username)
        if (!profile.sync) profile.sync = {} as Types.Profile.Sync
        for(const key in syncDetails) profile.sync[key] = syncDetails[key]
    }
}
  
export const Context = createContext(new Instance)

  