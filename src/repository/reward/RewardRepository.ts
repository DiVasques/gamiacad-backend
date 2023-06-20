import { Reward } from '@/models/Reward'
import { BaseRepository } from '@/repository/base/BaseRepository'
import { IRewardRepository } from '@/repository/reward/IRewardRepository'
import mongoose, { Document, Schema } from 'mongoose'
import autoIncrement from 'mongoose-auto-increment';
import { v4 as uuid } from 'uuid'

export class RewardRepository extends BaseRepository<Reward> implements IRewardRepository {
    constructor() {
        autoIncrement.initialize(mongoose.connection);
        let rewardSchema = new Schema<Reward>(
            {
                _id: { type: String, default: uuid },
                name: { type: String, required: true },
                description: { type: String, required: true },
                price: { type: Number, required: true },
                availability: { type: Number, required: true },
                claimers: { type: [String], default: [] },
                handed: { type: [String], default: [] }
            },
            {
                timestamps: true
            }
        )
        rewardSchema.plugin(autoIncrement.plugin, { model: 'Reward', field: 'number' });
        let rewardModel = mongoose.model<Reward & Document>('Reward', rewardSchema, 'Reward')
        super(rewardModel)
    }
}