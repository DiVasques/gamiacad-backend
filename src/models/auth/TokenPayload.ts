import { JwtPayload } from 'jsonwebtoken';
import { Role } from '@/models/auth/Role';

export interface TokenPayload extends JwtPayload {
    roles: Role[]
}