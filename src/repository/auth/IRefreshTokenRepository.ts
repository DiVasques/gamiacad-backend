import { RefreshToken } from '@/models/auth/RefreshToken'

export interface IRefreshTokenRepository {
    findById: (id: string) => Promise<RefreshToken | null>
    create: (refreshToken: Partial<RefreshToken>) => Promise<void>
    delete: (id: string) => Promise<void>
}