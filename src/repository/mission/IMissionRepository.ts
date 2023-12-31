import { Mission } from '@/models/Mission'
import { MissionWithUsers } from '@/models/MissionWithUsers'
import { UserMission } from '@/models/UserMission'

export interface IMissionRepository {
    findById: (id: string) => Promise<(Mission) | null>,
    findOne: (obj: any) => Promise<(Mission) | null>,
    find: (obj?: any) => Promise<Mission[]>

    create: (Mission: Partial<Mission>) => Promise<void>
    update(_id: string, data: Partial<Mission>, options?: object): Promise<void>
    findOneAndUpdate: (filter: Partial<Mission>, item: Partial<Mission>) => Promise<(Mission) | null>

    getMissionByIdWithUsers: (id: string) => Promise<(MissionWithUsers) | null>
    getMissionsWithUsers: (filter: Partial<Mission>) => Promise<MissionWithUsers[]>

    subscribeUser: (_id: string, userId: string, createdBy: string) => Promise<number>
    completeMission: (_id: string, userId: string, createdBy: string) => Promise<number>
    deactivateMission: (_id: string) => Promise<void>

    findUserActiveMissions: (userId: string) => Promise<UserMission[]>
    findUserParticipatingMissions: (userId: string) => Promise<UserMission[]>
    findUserCompletedMissions: (userId: string) => Promise<UserMission[]>
}