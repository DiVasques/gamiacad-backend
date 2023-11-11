import { Mission } from '@/models/Mission'
import { MissionWithUsers } from '@/models/MissionWithUsers'
import { UserMission } from '@/models/UserMission'
import { BaseRepository } from '@/repository/base/BaseRepository'
import { IMissionRepository } from '@/repository/mission/IMissionRepository'
import { MissionSchema } from '@/repository/schemas/MissionSchema'
import mongoose, { Document } from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'

export class MissionRepository extends BaseRepository<Mission> implements IMissionRepository {
    constructor() {
        autoIncrement.initialize(mongoose.connection)
        const missionSchema = MissionSchema
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
                        localField: 'participants.id',
                        foreignField: '_id',
                        as: 'participantsInfo'
                    }
                },
                {
                    $lookup:
                    {
                        from: 'User',
                        localField: 'completers.id',
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
                        localField: 'participants.id',
                        foreignField: '_id',
                        as: 'participantsInfo'
                    }
                },
                {
                    $lookup:
                    {
                        from: 'User',
                        localField: 'completers.id',
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
            { _id, 'participants.id': { $ne: userId }, 'completers.id': { $ne: userId }, createdBy: { $ne: userId }, active: true, expirationDate: { $gt: new Date() } },
            { $push: { participants: { id: userId, date: new Date() } } }
        ).exec()
        return modifiedCount
    }

    async completeMission(_id: string, userId: string): Promise<number> {
        const { modifiedCount } = await this.model.updateOne(
            { _id, 'participants.id': userId, 'completers.id': { $ne: userId }, active: true },
            { $push: { completers: { id: userId, date: new Date() } }, $pull: { participants: { id: userId } } }
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
                        'participants.id': { $ne: userId },
                        'completers.id': { $ne: userId },
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
                        'participants.id': userId,
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
                        'completers.id': userId
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