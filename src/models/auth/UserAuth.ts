import { Role } from '@/models/auth/Role';

export interface UserAuth {
    _id: string
    uuid: string
    password: string
    roles: Role[]
}