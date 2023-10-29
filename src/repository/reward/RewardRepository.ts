import { Reward } from '@/models/Reward'
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
            { _id, claimers: userId },
            { $push: { handed: userId }, $pull: { claimers: userId } }
        ).exec()
        return modifiedCount
    }

    async deactivateReward(_id: string): Promise<number> {
        const { modifiedCount } = await this.model.updateOne(
            { _id, active: { $ne: false } },
            { $set: { active: false } }
        ).exec()
        return modifiedCount
    }

    async findAvailableRewards(userId: string): Promise<Reward[]> {
        return await this.model.find({ availability: { $gt: 0 }, claimers: { $ne: userId }, active: true })
            .lean().sort({ number: 1 }).exec()
    }

    async findClaimedRewards(userId: string): Promise<Reward[]> {
        return await this.model.find({ claimers: userId }).lean().sort({ number: 1 }).exec()
    }

    async findHandedRewards(userId: string): Promise<Reward[]> {
        return await this.model.find({ handed: userId }).lean().sort({ number: 1 }).exec()
    }
}