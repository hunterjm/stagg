import IDB from 'idb-kv'
import config from '../config'
import { Types } from './index'
export const Load = async key => new IDB(config.idb.store).get(key)
export const Save = (key,val) => new IDB(config.idb.store).set(key,val)
export const LoadMatch = async (matchId:string) => 
    Load(`match:${matchId}`)
export const AddMatch = (match:Types.Match) => 
    Save(`match:${match.matchId}`, match)
export const LoadPerformance = async (matchId:string, { key }:Partial<Types.Profile>) => 
    Load(`performance:${matchId}:${key}`)
export const AddPerformance = ({ key }:Partial<Types.Profile>, performance:Types.Performance) => 
    Save(`performance:${performance.matchId}:${key}`, performance)
export const LoadMatchIds = async ({ key }:Partial<Types.Profile>) => 
    Load(`matchIds:${key}`)
export const SaveMatchIds = ({ key }:Partial<Types.Profile>, matchIds:string[]) => 
    Save(`matchIds:${key}`, matchIds)
export const LoadProfiles = async () => 
    Load('profiles')
export const SaveProfiles = async (profiles:Types.Profile[]) => {
    Save('profiles', profiles)
}