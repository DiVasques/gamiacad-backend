import { UserAuth } from '@/models/auth/UserAuth'
import { BaseRepository } from '@/repository/base/BaseRepository'
import { IAuthRepository } from '@/repository/auth/IAuthRepository'
import mongoose, { Document, Schema } from 'mongoose'
import { v4 as uuid } from 'uuid'

export class AuthRepository extends BaseRepository<UserAuth> implements IAuthRepository {
    constructor() {
        super(mongoose.model<UserAuth & Document>(
            'Auth',
            new Schema<UserAuth>(
                {
                    _id: { type: String, required: true },
                    uuid: { type: String, default: uuid },
                    password: { type: String, required: true },
                    roles: { type: [String], default: ['user'] }
                },
                {
                    timestamps: true
                }
            ),
            'Auth')
        )
    }

    async registerUser(user: Partial<UserAuth>): Promise<UserAuth> {
        return await this.model.create(user)
    }
}