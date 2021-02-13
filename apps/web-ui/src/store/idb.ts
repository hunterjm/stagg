import IDB from 'idb-kv'
const IDB_STORE_NAME = 'stagg'
export const idbGet = async key => new IDB(IDB_STORE_NAME).get(key)
export const idbPut = (key,val) => new IDB(IDB_STORE_NAME).set(key,val)