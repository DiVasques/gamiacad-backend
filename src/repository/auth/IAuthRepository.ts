import { UserAuth } from '@/models/auth/UserAuth'

export interface IAuthRepository {
    findById: (id: string) => Promise<(UserAuth) | null>
    registerUser: (user: Partial<UserAuth>) => Promise<UserAuth>
    enableUser: (id: string) => Promise<number>
    disableUser: (id: string) => Promise<number>
    giveAdminPrivileges: (id: string) => Promise<number>
    revokeAdminPrivileges: (id: string) => Promise<number>
}