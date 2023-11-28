import { Role } from '@/models/auth/Role'
import { TokenPayload } from '@/models/auth/TokenPayload'
import jwt from 'jsonwebtoken'

export const userId = 'f94fbe96-373e-49b1-81c0-0df716e9b2ee'
export const adminUserId = '0625d085-b259-499e-9b28-0ef38fd0d727'
export const unauthorizedUserId = 'f76e3a91-e39f-4ecf-bac3-3e8bc58acb1d'

const generateHeaders = (authorized: boolean, admin: boolean, userId: string) => {
    const roles: Role[] = ['user']
    if (admin) {
        roles.push('admin')
    }

    const payload: TokenPayload = {
        sub: userId,
        roles
    }
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET ?? 'ERROR', { expiresIn: '30m' })

    return {
        clientId: process.env.CLIENT_ID ?? 'ERROR',
        'X-Forwarded-For': '192.168.2.1',
        authorization: authorized ? `Bearer ${token}` : ''
    }
}

export const adminHeaders = generateHeaders(true, true, adminUserId)

export const userHeaders = generateHeaders(true, false, userId)

export const unauthorizedHeaders = generateHeaders(false, false, unauthorizedUserId)