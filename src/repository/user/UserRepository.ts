import { User } from '@/models/User'
import { BaseRepository } from '@/repository/base/BaseRepository'
import { IUserRepository } from '@/repository/user/IUserRepository'
import mongoose, { Document, Schema } from 'mongoose'
import { v4 as uuid } from 'uuid'

export class UserRepository extends BaseRepository<User> implements IUserRepository {
    constructor() {
        super(mongoose.model<User & Document>(
            'User',
            new Schema<User>(
                {
                    _id: { type: String, default: uuid },
                    name: { type: String, required: true },
                    email: { type: String, required: true },
                    balance: { type: Number, default: 0 },
                    totalPoints: { type: Number, default: 0 }
                },
                {
                    timestamps: true
                }
            ),
            'User')
        )
    }

    async givePoints(_id: string, points: number): Promise<void> {
        await this.model.updateOne(
            { _id },
            { $inc: { balance: points, totalPoints: points } }
        ).exec()
    }
}