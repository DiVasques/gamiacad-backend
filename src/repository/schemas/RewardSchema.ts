import { ActionWithDateSchema } from '@/repository/schemas/ActionWithDateSchema';
import { Reward } from '@/models/Reward';
import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid'

export const RewardSchema = new Schema<Reward>(
    {
        _id: { type: String, default: uuid },
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        availability: { type: Number, required: true },
        claimers: { type: [ActionWithDateSchema], default: [] },
        handed: { type: [ActionWithDateSchema], default: [] },
        active: { type: Boolean, default: true },
    },
    {
        timestamps: true
    }
)