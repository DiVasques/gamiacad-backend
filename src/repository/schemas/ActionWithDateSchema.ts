import { ActionWithDate } from '@/models/ActionWithDate';
import { Schema } from 'mongoose';

export const ActionWithDateSchema = new Schema<ActionWithDate>(
    {
        id: { type: String, required: true },
        date: { type: Date, required: true },
        createdBy: { type: String, required: true },
    },
    {
        _id: false
    }
)