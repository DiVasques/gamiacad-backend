import { Reward } from '@/models/Reward'
import { RewardWithUsers } from '@/models/RewardWithUsers'
import { UserReward } from '@/models/UserReward'
import { BaseRepository } from '@/repository/base/BaseRepository'
import { IRewardRepository } from '@/repository/reward/IRewardRepository'
import mongoose, { Document, Schema } from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'
import { v4 as uuid } from 'uuid'

export class RewardRepository extends BaseRepository<Reward> implements IRewardRepository {
    constructor() {
        autoIncrement.initialize(mongoose.connection)
        const rewardSchema = new Schema<Reward>(
            {
                _id: { type: String, default: uuid },
                name: { type: String, required: true },
                description: { type: String, required: true },
                price: { type: Number, required: true },
                availability: { type: Number, required: true },
                claimers: { type: [String], default: [] },
                handed: { type: [String], default: [] },
                active: { type: Boolean, default: true },
            },
            {
                timestamps: true
            }
        )
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
                        localField: 'claimers',
                        foreignField: '_id',
                        as: 'claimersInfo'
                    }
                },
                {
                    $lookup:
                    {
                        from: 'User',
                        localField: 'handed',
                        foreignField: '_id',
                        as: 'handedInfo'
                    }
                }
            ]
        ).sort({ number: -1 }).exec()
    }

    async claimReward(_id: string, userId: string): Promise<number> {
        const { modifiedCount } = await this.model.updateOne(
            { _id, availability: { $gt: 0 }, claimers: { $ne: userId }, active: true },
            { $push: { claimers: userId }, $inc: { availability: -1 } }
        ).exec()
        return modifiedCount
    }

    async rollbackClaim(_id: string, userId: string): Promise<number> {
        const { modifiedCount } = await this.model.updateOne(
            { _id, claimers: userId },
            { $pull: { claimers: userId }, $inc: { availability: 1 } }
        ).exec()
        return modifiedCount
    }

    async handReward(_id: string, userId: string): Promise<number> {
        const { modifiedCount } = await this.model.updateOne(
            { _id, claimers: userId, active: true },
            { $push: { handed: userId }, $pull: { claimers: userId } }
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

    async findAvailableRewards(userId: string): Promise<UserReward[]> {
        return await this.model.aggregate(
            [
                {
                    $match: {
                        availability: { $gt: 0 },
                        claimers: { $ne: userId },
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

    async findClaimedRewards(userId: string): Promise<UserReward[]> {
        return await this.model.aggregate(
            [
                {
                    $match: {
                        claimers: userId
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

    async findHandedRewards(userId: string): Promise<UserReward[]> {
        return await this.model.aggregate(
            [
                {
                    $match: {
                        handed: userId
                    }
                },
                {
                    $addFields: {
                        count: {
                            $size: {
                                $filter: {
                                    input: '$handed',
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