import { RefreshToken } from '@/models/auth/RefreshToken'
import { BaseRepository } from '@/repository/base/BaseRepository'
import { IRefreshTokenRepository } from '@/repository/auth/IRefreshTokenRepository'
import mongoose, { Document, Schema } from 'mongoose'

export class RefreshTokenRepository extends BaseRepository<RefreshToken> implements IRefreshTokenRepository {
    constructor() {
        super(mongoose.model<RefreshToken & Document>(
            'RefreshToken',
            new Schema<RefreshToken>(
                {
                    _id: { type: String, required: true },
                    token: { type: String, required: true },
                    clientIp: { type: String, required: true }
                },
                {
                    timestamps: true
                }
            ),
            'RefreshToken')
        )
    }
}