import { State, createState, useState } from '@hookstate/core'
import { UserStateModel, getUser } from 'src/hooks/getUser'
import { Cookies } from './cookies'

export { createState, useState }
export { idbGet, idbPut } from './idb'
export const cookies = new Cookies()
export const userState:State<UserStateModel> = createState(getUser())
