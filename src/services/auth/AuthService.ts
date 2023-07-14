import { Inject, Service } from 'typedi'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';
import { ServiceToken } from '@/config/di'
import AppError from '@/models/error/AppError'
import ExceptionStatus from '@/utils/enum/ExceptionStatus'
import { IAuthRepository } from '@/repository/auth/IAuthRepository'
import { TokenPayload } from '@/models/auth/TokenPayload';

@Service()
export class AuthService {
    @Inject(ServiceToken.authRepository)
    private authRepository: IAuthRepository

    async registerUser(user: {
        registration: string,
        password: string
    }): Promise<string> {
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
        const token = jwt.sign(payload, TOKEN_SECRET, { expiresIn: '30s' })
        return token
    }
}