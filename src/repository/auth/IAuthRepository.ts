import { UserAuth } from '@/models/auth/UserAuth'

export interface IAuthRepository {
    findById: (id: string) => Promise<(UserAuth) | null>
    registerUser: (user: Partial<UserAuth>) => Promise<UserAuth>
}