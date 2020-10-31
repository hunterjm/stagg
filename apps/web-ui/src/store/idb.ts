import IDB from 'idb-kv'
import cfg from 'config/ui'
export const Load = async key => new IDB(cfg.idb.store).get(key)
export const Save = (key,val) => new IDB(cfg.idb.store).set(key,val)