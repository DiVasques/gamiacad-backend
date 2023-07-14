import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import AppError from '@/models/error/AppError'
import ExceptionStatus from '@/utils/enum/ExceptionStatus'
import { TokenPayload } from '@/models/auth/TokenPayload'

export class Auth {
    static validateClient(req: Request, res: Response, next: NextFunction) {
        const { CLIENT_ID } = process.env
        if (!CLIENT_ID) {
            throw new AppError(ExceptionStatus.serviceUnavailable, 503)
        }
        
        const { clientid } = req.headers
        if (!clientid) {
            throw new AppError(ExceptionStatus.invalidHeaders, 401)
        }

        if (clientid !== CLIENT_ID) {
            throw new AppError(ExceptionStatus.unauthorizedClient, 401)
        }

        return next()
    }

    static authenticate(req: Request, res: Response, next: NextFunction) {
        const { TOKEN_SECRET } = process.env
        if (!TOKEN_SECRET) {
            throw new AppError(ExceptionStatus.serviceUnavailable, 503)
        }
        
        const { authorization } = req.headers
        if (!authorization) {
            throw new AppError(ExceptionStatus.invalidHeaders, 401)
        }

        const [auth, token] = authorization.split(' ')
        if (!token || auth !== 'Bearer') {
            throw new AppError(ExceptionStatus.invalidAuthorization, 401)
        }

        const { userId, roles } = Auth.validateToken(token, TOKEN_SECRET)
        req.headers.userId = userId
        req.headers.roles = roles

        return next()
    }

    private static validateToken(token: string, secret: string) {
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
}