import { Account as AccountEntity, AccountRepository } from './account'
import { AccountAuth as AuthEntity, AuthRepository } from './auth'
import { AccountProfile as ProfileEntity } from './profile'

export const Base = {
    Entity: AccountEntity,
    Repository: AccountRepository
}

export const Auth = {
    Entity: AuthEntity,
    Repository: AuthRepository
}

export const Profile = {
    Entity: ProfileEntity
}