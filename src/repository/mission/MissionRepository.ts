import { Mission } from '@/models/Mission'
import { MissionWithUsers } from '@/models/MissionWithUsers'
import { UserMission } from '@/models/UserMission'
import { BaseRepository } from '@/repository/base/BaseRepository'
import { IMissionRepository } from '@/repository/mission/IMissionRepository'
import mongoose, { Document, Schema } from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'
import { v4 as uuid } from 'uuid'

export class MissionRepository extends BaseRepository<Mission> implements IMissionRepository {
    constructor() {
        autoIncrement.initialize(mongoose.connection)
        const missionSchema = new Schema<Mission>(
            {
                _id: { type: String, default: uuid },
                name: { type: String, required: true },
                createdBy: { type: String, required: true },
                description: { type: String, required: true },
                points: { type: Number, required: true },
                expirationDate: { type: Date, required: true },
                participants: { type: [String], default: [] },
                completers: { type: [String], default: [] },
                active: { type: Boolean, default: true },
            },
            {
                timestamps: true
            }
        )
        missionSchema.plugin(autoIncrement.plugin, { model: 'Mission', field: 'number' })
        const missionModel = mongoose.model<Mission & Document>('Mission', missionSchema, 'Mission')
        super(missionModel)
    }

    async getMissionByIdWithUsers(_id: string): Promise<(MissionWithUsers) | null> {
        const missions = await this.model.aggregate(
            [
                {
                    $match: { _id }
                },
                {
                    $lookup:
                    {
                        from: 'User',
                        localField: 'participants',
                        foreignField: '_id',
                        as: 'participantsInfo'
                    }
                },
                {
                    $lookup:
                    {
                        from: 'User',
                        localField: 'completers',
                        foreignField: '_id',
                        as: 'completersInfo'
                    }
                },
                {
                    $lookup:
                    {
                        from: 'User',
                        localField: 'createdBy',
                        foreignField: '_id',
                        as: 'createdByInfo'
                    },
                },
                {
                    $unwind: {
                        path: '$createdByInfo',
                        preserveNullAndEmptyArrays: true
                    }
                }
            ]
        ).exec()

        if (!missions) {
            return null
        }
        return missions.at(0)
    }

    async getMissionsWithUsers(filter: any = {}): Promise<MissionWithUsers[]> {
        return await this.model.aggregate(
            [
                {
                    $match: filter
                },
                {
                    $lookup:
                    {
                        from: 'User',
                        localField: 'participants',
                        foreignField: '_id',
                        as: 'participantsInfo'
                    }
                },
                {
                    $lookup:
                    {
                        from: 'User',
                        localField: 'completers',
                        foreignField: '_id',
                        as: 'completersInfo'
                    }
                },
                {
                    $lookup:
                    {
                        from: 'User',
                        localField: 'createdBy',
                        foreignField: '_id',
                        as: 'createdByInfo'
                    },
                },
                {
                    $unwind: {
                        path: '$createdByInfo',
                        preserveNullAndEmptyArrays: true
                    }
                }
            ]
        ).sort({ number: -1 }).exec()
    }

    async subscribeUser(_id: string, userId: string): Promise<number> {
        const { modifiedCount } = await this.model.updateOne(
            { _id, participants: { $ne: userId }, completers: { $ne: userId }, createdBy: { $ne: userId }, active: true },
            { $push: { participants: userId } }
        ).exec()
        return modifiedCount
    }

    async completeMission(_id: string, userId: string): Promise<number> {
        const { modifiedCount } = await this.model.updateOne(
            { _id, participants: userId, completers: { $ne: userId }, active: true },
            { $push: { completers: userId }, $pull: { participants: userId } }
        ).exec()
        return modifiedCount
    }

    async deactivateMission(_id: string): Promise<void> {
        await this.model.updateOne(
            { _id },
            { $set: { active: false } }
        ).exec()
    }

    async findUserActiveMissions(userId: string): Promise<UserMission[]> {
        return await this.model.aggregate(
            [
                {
                    $match: {
                        expirationDate: { $gt: new Date() },
                        participants: { $ne: userId },
                        completers: { $ne: userId },
                        createdBy: { $ne: userId },
                        active: true
                    }
                },
                {
                    $project: {
                        participants: 0,
                        completers: 0
                    }
                }
            ]
        ).sort({ number: -1 }).exec()
    }

    async findUserParticipatingMissions(userId: string): Promise<UserMission[]> {
        return await this.model.aggregate(
            [
                {
                    $match: {
                        expirationDate: { $gt: new Date() },
                        participants: userId,
                        active: true
                    }
                },
                {
                    $project: {
                        participants: 0,
                        completers: 0
                    }
                }
            ]
        ).sort({ number: -1 }).exec()
    }

    async findUserCompletedMissions(userId: string): Promise<UserMission[]> {
        return await this.model.aggregate(
            [
                {
                    $match: {
                        completers: userId
                    }
                },
                {
                    $project: {
                        participants: 0,
                        completers: 0
                    }
                }
            ]
        ).sort({ number: -1 }).exec()
    }
}