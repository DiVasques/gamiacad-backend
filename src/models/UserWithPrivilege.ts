import { User } from './User'

export interface UserWithPrivilege extends User {
    admin: boolean
    active: boolean
}
