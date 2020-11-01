import { State, createState, useState } from '@hookstate/core'
import { UserStateModel, getUser } from 'src/hooks/getUser'
export * from './idb'
export { createState, useState }
export const userState:State<UserStateModel> = createState(getUser())
