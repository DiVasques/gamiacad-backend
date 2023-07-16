import { Inject, Service } from 'typedi'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { ServiceToken } from '@/config/di'
import AppError from '@/models/error/AppError'
import ExceptionStatus from '@/utils/enum/ExceptionStatus'
import { IAuthRepository } from '@/repository/auth/IAuthRepository'
import { TokenPayload } from '@/models/auth/TokenPayload'
import { AuthResult } from '@/ports/auth/AuthResult'

@Service()
export class AuthService {
    @Inject(ServiceToken.authRepository)
    private authRepository: IAuthRepository

    async registerUser(user: {
        registration: string,
        password: string
    }): Promise<AuthResult> {
        const { TOKEN_SECRET } = process.env
        if (!TOKEN_SECRET) {
            throw new AppError(ExceptionStatus.serviceUnavailable, 503)
        }

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
        const payload: TokenPayload = {
            sub: createdUser.uuid,
            roles: createdUser.roles
        }
        const accessToken = jwt.sign(payload, TOKEN_SECRET, { expiresIn: '30s' })
        return  { userId: createdUser.uuid, accessToken }
    }

    async loginUser(user: {
        registration: string,
        password: string
    }): Promise<AuthResult> {
        const { TOKEN_SECRET } = process.env
        if (!TOKEN_SECRET) {
            throw new AppError(ExceptionStatus.serviceUnavailable, 503)
        }

        const userAuth = await this.authRepository.findById(user.registration)
        if (!userAuth) {
            throw new AppError(ExceptionStatus.invalidCredentials, 401)
        }

        if (!bcrypt.compareSync(user.password, userAuth.password)) {
            throw new AppError(ExceptionStatus.invalidCredentials, 401)
        }

        const payload: TokenPayload = {
            sub: userAuth.uuid,
            roles: userAuth.roles
        }
        const accessToken = jwt.sign(payload, TOKEN_SECRET, { expiresIn: '30s' })
        return { userId: userAuth.uuid, accessToken }
    }
}