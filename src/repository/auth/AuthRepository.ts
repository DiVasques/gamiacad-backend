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
                    roles: { type: [String], default: ['user'] },
                    active: { type: Boolean, default: true },
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

    async enableUser(userId: string): Promise<number> {
        const { modifiedCount } = await this.model.updateOne(
            { uuid: userId, active: false },
            { $set: { active: true } }
        ).exec()
        return modifiedCount
    }

    async disableUser(userId: string): Promise<number> {
        const { modifiedCount } = await this.model.updateOne(
            { uuid: userId, active: true },
            { $set: { active: false } }
        ).exec()
        return modifiedCount
    }

    async giveAdminPrivileges(userId: string): Promise<number> {
        const { modifiedCount } = await this.model.updateOne(
            { uuid: userId, roles: { $ne: 'admin' } },
            { $push: { roles: 'admin' } }
        ).exec()
        return modifiedCount
    }

    async revokeAdminPrivileges(userId: string): Promise<number> {
        const { modifiedCount } = await this.model.updateOne(
            { uuid: userId, roles: 'admin' },
            { $pull: { roles: 'admin' } }
        ).exec()
        return modifiedCount
    }
}