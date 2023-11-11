import { ActionWithDateSchema } from '@/repository/schemas/ActionWithDateSchema';
import { Mission } from '@/models/Mission';
import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid'

export const MissionSchema = new Schema<Mission>(
    {
        _id: { type: String, default: uuid },
        name: { type: String, required: true },
        createdBy: { type: String, required: true },
        description: { type: String, required: true },
        points: { type: Number, required: true },
        expirationDate: { type: Date, required: true },
        participants: { type: [ActionWithDateSchema], default: [] },
        completers: { type: [ActionWithDateSchema], default: [] },
        active: { type: Boolean, default: true },
    },
    {
        timestamps: true
    }
)