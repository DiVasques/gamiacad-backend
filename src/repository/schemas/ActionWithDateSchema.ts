import { ActionWithDate } from '@/models/ActionWithDate';
import { Schema } from 'mongoose';

export const ActionWithDateSchema = new Schema<ActionWithDate>(
    {
        id: { type: String, required: true },
        date: { type: Date, required: true },
    },
    {
        _id: false
    }
)