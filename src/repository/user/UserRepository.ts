import { User } from '@/models/User'
import { UserWithPrivilege } from '@/models/UserWithPrivilege'
import { BaseRepository } from '@/repository/base/BaseRepository'
import { IUserRepository } from '@/repository/user/IUserRepository'
import mongoose, { Document, Schema } from 'mongoose'

export class UserRepository extends BaseRepository<User> implements IUserRepository {
    constructor() {
        super(mongoose.model<User & Document>(
            'User',
            new Schema<User>(
                {
                    _id: { type: String, required: true },
                    name: { type: String, required: true },
                    email: { type: String, required: true },
                    registration: { type: String, required: true },
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

    async givePoints(_id: string, points: number, rollingBack?: boolean): Promise<void> {
        await this.model.updateOne(
            { _id },
            { $inc: { balance: points, totalPoints: rollingBack ? 0 : points } }
        ).exec()
    }

    async withdrawPoints(_id: string, points: number): Promise<number> {
        const {modifiedCount} = await this.model.updateOne(
            { _id, balance: { $gte: points } },
            { $inc: { balance: -points } }
        ).exec()
        return modifiedCount
    }

    async getUsersWithPrivilege(filter: any = {}): Promise<UserWithPrivilege[]> {
        return await this.model.aggregate(
            [
                {
                    $match: filter
                },
                {
                    $lookup:
                    {
                        from: 'Auth',
                        localField: '_id',
                        foreignField: 'uuid',
                        as: 'authInfo'
                    }
                },
                {
                  $unwind: '$authInfo'
                },
                {
                  $addFields: {
                    admin: {
                      $cond: {
                        if: {
                          $in: ['admin', '$authInfo.roles']
                        },
                        then: true,
                        else: false
                      }
                    }
                  }
                },
                {
                  $addFields: {
                    active: '$authInfo.active',
                  }
                },
                {
                  $project: {
                    authInfo: 0,
                  }
                }
            ]
        ).sort({ name: 1 }).exec()
    }
}