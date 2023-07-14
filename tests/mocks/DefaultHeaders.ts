import { TokenPayload } from '@/models/auth/TokenPayload'
import jwt from 'jsonwebtoken'

const payload: TokenPayload = {
    sub: '1234567890',
    roles: ['user']
}
const token = jwt.sign(payload, process.env.TOKEN_SECRET ?? 'ERROR', { expiresIn: '30m' })
export const defaultHeaders = {
    clientId: process.env.CLIENT_ID,
    authorization: `Bearer ${token}`
}