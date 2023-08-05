import { Request, Response, NextFunction } from 'express'
import AppError from '@/models/error/AppError'
import ExceptionStatus from '@/utils/enum/ExceptionStatus'
import validateToken from '@/helpers/validateToken'
import { Role } from '@/models/auth/Role'

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
        const { ACCESS_TOKEN_SECRET } = process.env
        if (!ACCESS_TOKEN_SECRET) {
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

        const { userId, roles } = validateToken(token, ACCESS_TOKEN_SECRET)
        req.headers.userId = userId
        req.headers.roles = roles

        return next()
    }

    static authorizeUser(req: Request, res: Response, next: NextFunction) {
        const { userId, roles } = req.headers
        if ((roles as Role[]).includes('admin')) {
            return next()
        }
        if (req.originalUrl.includes(userId as string)) {
            return next()
        }
        throw new AppError(ExceptionStatus.forbiddenResource, 403)
    }

    static authorizeAdminOnly(req: Request, res: Response, next: NextFunction) {
        const { roles } = req.headers
        if ((roles as Role[]).includes('admin')) {
            return next()
        }
        throw new AppError(ExceptionStatus.forbiddenResource, 403)
    }
}