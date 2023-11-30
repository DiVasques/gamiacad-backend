import { Inject, Service } from 'typedi'
import { ServiceToken } from '@/config/di'
import AppError from '@/models/error/AppError'
import ExceptionStatus from '@/utils/enum/ExceptionStatus'
import { IAuthRepository } from '@/repository/auth/IAuthRepository'
import { IRefreshTokenRepository } from '@/repository/auth/IRefreshTokenRepository'

@Service()
export class SecureAuthService {
    @Inject(ServiceToken.authRepository)
    private authRepository: IAuthRepository
    @Inject(ServiceToken.refreshTokenRepository)
    private refreshTokenRepository: IRefreshTokenRepository

    async updateUserStatus(id: string, active: boolean): Promise<void> {
        await this.updateStatus(id, active)
        await this.refreshTokenRepository.delete(id)
    }

    async updateAdminPrivileges(id: string, admin: boolean): Promise<void> {
        await this.updatePrivileges(id, admin)
        await this.refreshTokenRepository.delete(id)
    }

    private async updateStatus(id: string, active: boolean): Promise<void> {
        if (active) {
            const modifiedCount = await this.authRepository.enableUser(id)
            if (modifiedCount === 0) {
                throw new AppError(ExceptionStatus.cantEnableUser, 400)
            }
            return
        }
        const modifiedCount = await this.authRepository.disableUser(id)
        if (modifiedCount === 0) {
            throw new AppError(ExceptionStatus.cantDisableUser, 400)
        }
    }

    private async updatePrivileges(id: string, admin: boolean): Promise<void> {
        if (admin) {
            const modifiedCount = await this.authRepository.giveAdminPrivileges(id)
            if (modifiedCount === 0) {
                throw new AppError(ExceptionStatus.cantGiveAdminPrivileges, 400)
            }
            return
        }
        const modifiedCount = await this.authRepository.revokeAdminPrivileges(id)
        if (modifiedCount === 0) {
            throw new AppError(ExceptionStatus.cantRevokeAdminPrivileges, 400)
        }
    }
}