import { ClaimedReward } from '@/models/ClaimedReward'
import { Reward } from '@/models/Reward'
import { RewardWithUsers } from '@/models/RewardWithUsers'
import { UserReward } from '@/models/UserReward'
import { BaseRepository } from '@/repository/base/BaseRepository'
import { IRewardRepository } from '@/repository/reward/IRewardRepository'
import { RewardSchema } from '@/repository/schemas/RewardSchema'
import mongoose, { Document } from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'

export class RewardRepository extends BaseRepository<Reward> implements IRewardRepository {
    constructor() {
        autoIncrement.initialize(mongoose.connection)
        const rewardSchema = RewardSchema
        rewardSchema.plugin(autoIncrement.plugin, { model: 'Reward', field: 'number' })
        const rewardModel = mongoose.model<Reward & Document>('Reward', rewardSchema, 'Reward')
        super(rewardModel)
    }

    async getRewardsWithUsers(filter: any = {}): Promise<RewardWithUsers[]> {
        return await this.model.aggregate(
            [
                {
                    $match: filter
                },
                {
                    $lookup:
                    {
                        from: 'User',
                        localField: 'claimers.id',
                        foreignField: '_id',
                        as: 'claimersInfo'
                    }
                },
                {
                    $lookup:
                    {
                        from: 'User',
                        localField: 'handed.id',
                        foreignField: '_id',
                        as: 'handedInfo'
                    }
                }
            ]
        ).sort({ number: -1 }).exec()
    }

    async claimReward(_id: string, userId: string): Promise<number> {
        const { modifiedCount } = await this.model.updateOne(
            { _id, availability: { $gt: 0 }, 'claimers.id': { $ne: userId }, active: true },
            { $push: { claimers: { id: userId, date: new Date() } }, $inc: { availability: -1 } }
        ).exec()
        return modifiedCount
    }

    async rollbackClaim(_id: string, userId: string): Promise<number> {
        const { modifiedCount } = await this.model.updateOne(
            { _id, 'claimers.id': userId },
            { $pull: { claimers: { id: userId } }, $inc: { availability: 1 } }
        ).exec()
        return modifiedCount
    }

    async handReward(_id: string, userId: string): Promise<number> {
        const { modifiedCount } = await this.model.updateOne(
            { _id, 'claimers.id': userId, active: true },
            { $push: { handed: { id: userId, date: new Date() } }, $pull: { claimers: { id: userId } } }
        ).exec()
        return modifiedCount
    }

    async deactivateReward(_id: string): Promise<number> {
        const { modifiedCount } = await this.model.updateOne(
            { _id, active: true },
            { $set: { active: false } }
        ).exec()
        return modifiedCount
    }

    async findClaimedRewards(): Promise<ClaimedReward[]> {
        return await this.model.aggregate(
            [
                {
                    $match: { claimers: { $exists: true, $ne: [] } }
                },
                {
                  $unwind: '$claimers',
                },
                {
                    $lookup:
                    {
                        from: 'User',
                        localField: 'claimers.id',
                        foreignField: '_id',
                        as: 'claimersInfo'
                    }
                },
                {
                  $unwind: '$claimersInfo'
                },
                {
                  $project: {
                    _id: 1,
                    name: 1,
                    number: 1,
                    price: 1,
                    claimer: {
                        id: '$claimers.id',
                        name: '$claimersInfo.name'
                    },
                    claimDate: '$claimers.date',
                  },
                },
            ]
        ).sort({ claimDate: -1 }).exec()
    }

    async findUserAvailableRewards(userId: string): Promise<UserReward[]> {
        return await this.model.aggregate(
            [
                {
                    $match: {
                        availability: { $gt: 0 },
                        'claimers.id': { $ne: userId },
                        active: true
                    }
                },
                {
                    $project: {
                        claimers: 0,
                        handed: 0
                    }
                }
            ]
        ).sort({ name: 1 }).exec()
    }

    async findUserClaimedRewards(userId: string): Promise<UserReward[]> {
        return await this.model.aggregate(
            [
                {
                    $match: {
                        'claimers.id': userId
                    }
                },
                {
                    $project: {
                        claimers: 0,
                        handed: 0
                    }
                }
            ]
        ).sort({ name: 1 }).exec()
    }

    async findUserHandedRewards(userId: string): Promise<UserReward[]> {
        return await this.model.aggregate(
            [
                {
                    $match: {
                        'handed.id': userId
                    }
                },
                {
                    $addFields: {
                        count: {
                            $size: {
                                $filter: {
                                    input: '$handed.id',
                                    as: 'handedList',
                                    cond: { $eq: ['$$handedList', userId] }
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        claimers: 0,
                        handed: 0
                    }
                }
            ]
        ).sort({ name: 1 }).exec()
    }
}