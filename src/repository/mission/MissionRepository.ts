import { Mission } from '@/models/Mission'
import { BaseRepository } from '@/repository/base/BaseRepository'
import { IMissionRepository } from '@/repository/mission/IMissionRepository'
import mongoose, { Document, Schema } from 'mongoose'
import { v4 as uuid } from 'uuid'

export class MissionRepository extends BaseRepository<Mission> implements IMissionRepository {
    constructor() {
        super(mongoose.model<Mission & Document>(
            'Mission',
            new Schema<Mission>(
                {
                    _id: { type: String, default: uuid },
                    name: { type: String, required: true },
                    createdBy: { type: String, required: true },
                    description: { type: String, required: true },
                    points: { type: Number, required: true },
                    expirationDate: { type: Date, required: true },
                    participants: { type: [], default: [] },
                    completers: { type: [], default: [] }
                },
                {
                    timestamps: true
                }
            ),
            'Mission')
        )
    }
}