import jwt from 'jsonwebtoken'
import { TokenPayload } from '@/models/auth/TokenPayload'
import AppError from '@/models/error/AppError'
import ExceptionStatus from '@/utils/enum/ExceptionStatus'

export default function validateToken(token: string, secret: string)  {
    try {
        jwt.verify(token, secret)
        const jwtPayload = jwt.decode(token) as TokenPayload
        return {
            userId: jwtPayload.sub,
            roles: jwtPayload.roles
        }
    } catch (e) {
        throw new AppError(ExceptionStatus.invalidToken, 401)
    }
}