import { Inject, Service } from 'typedi'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { ServiceToken } from '@/config/di'
import AppError from '@/models/error/AppError'
import ExceptionStatus from '@/utils/enum/ExceptionStatus'
import { IAuthRepository } from '@/repository/auth/IAuthRepository'
import { IRefreshTokenRepository } from '@/repository/auth/IRefreshTokenRepository'
import { TokenPayload } from '@/models/auth/TokenPayload'
import { AuthResult } from '@/ports/auth/AuthResult'
import { AuthRequest } from '@/ports/auth/AuthRequest'
import validateToken from '@/helpers/validateToken'
import { Role } from '@/models/auth/Role'

@Service()
export class AuthService {
    @Inject(ServiceToken.authRepository)
    private authRepository: IAuthRepository
    @Inject(ServiceToken.refreshTokenRepository)
    private refreshTokenRepository: IRefreshTokenRepository

    async registerUser(user: AuthRequest, clientIp: string): Promise<AuthResult> {
        const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = this.getSecrets()

        const result = await this.authRepository.findById(user.registration)
        if (result) {
            throw new AppError(ExceptionStatus.accountExists, 409)
        }

        const createdUser = await this.authRepository.registerUser(
            {
                _id: user.registration,
                password: await bcrypt.hash(user.password, 12)
            }
        )

        return await this.generateTokens(createdUser.uuid, createdUser.roles, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, clientIp)
    }

    async loginUser(user: AuthRequest, clientIp: string): Promise<AuthResult> {
        const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = this.getSecrets()

        const userAuth = await this.authRepository.findById(user.registration)
        if (!userAuth) {
            throw new AppError(ExceptionStatus.invalidCredentials, 401)
        }

        if (!bcrypt.compareSync(user.password, userAuth.password)) {
            throw new AppError(ExceptionStatus.invalidCredentials, 401)
        }

        return await this.generateTokens(userAuth.uuid, userAuth.roles, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, clientIp)
    }

    async refreshToken(token: string, clientIp: string): Promise<AuthResult> {
        const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = this.getSecrets()

        const { userId, roles } = await this.validateRefreshToken(token, REFRESH_TOKEN_SECRET, clientIp)

        return await this.generateTokens(userId, roles, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, clientIp, true)
    }

    async logoutUser(token: string, clientIp: string): Promise<void> {
        const { REFRESH_TOKEN_SECRET } = this.getSecrets()

        const { userId } = await this.validateRefreshToken(token, REFRESH_TOKEN_SECRET, clientIp)

        await this.refreshTokenRepository.delete(userId)
    }

    private getSecrets() {
        const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env
        if (!ACCESS_TOKEN_SECRET) {
            throw new AppError(ExceptionStatus.serviceUnavailable, 503)
        }
        if (!REFRESH_TOKEN_SECRET) {
            throw new AppError(ExceptionStatus.serviceUnavailable, 503)
        }
        return { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET }
    }

    private async generateTokens(
        userId: string,
        roles: Role[],
        accessTokenSecret: string,
        refreshTokenSecret: string,
        clientIp: string,
        isRefresh?: boolean
    ): Promise<AuthResult> {
        await this.refreshTokenRepository.delete(userId)

        const payload: TokenPayload = {
            sub: userId,
            roles
        }
        const accessToken = jwt.sign(payload, accessTokenSecret, { expiresIn: '5m' })
        const refreshToken = jwt.sign(payload, refreshTokenSecret, { expiresIn: isRefresh ? '2d' : '7d' })
        await this.refreshTokenRepository.create({
            _id: userId,
            clientIp,
            token: refreshToken
        })
        return { userId, accessToken, refreshToken }
    }

    private async validateRefreshToken(token: string, refreshTokenSecret: string, clientIp: string) {
        const { userId, roles } = validateToken(token, refreshTokenSecret)
        const storedUserToken = await this.refreshTokenRepository.findById(userId)
        if (!storedUserToken) {
            throw new AppError(ExceptionStatus.invalidToken, 401)
        }

        if (storedUserToken.token !== token || storedUserToken.clientIp !== clientIp) {
            throw new AppError(ExceptionStatus.invalidToken, 401)
        }

        return { userId, roles }
    }
}