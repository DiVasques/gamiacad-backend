import { Mission } from '@/models/Mission'
import { MissionWithUsers } from '@/models/MissionWithUsers'

export interface IMissionRepository {
    findById: (id: string) => Promise<(Mission) | null>,
    findOne: (obj: any) => Promise<(Mission) | null>,
    find: (obj?: any) => Promise<Mission[]>

    create: (Mission: Partial<Mission>) => Promise<void>
    update(_id: string, data: Partial<Mission>, options?: object): Promise<void>
    findOneAndUpdate: (filter: Partial<Mission>, item: Partial<Mission>) => Promise<(Mission) | null>

    getMissionsWithUsers: (filter: Partial<Mission>) => Promise<MissionWithUsers[]>
    
    subscribeUser: (_id: string, userId: string) => Promise<number>
    completeMission: (_id: string, userId: string) => Promise<number>
    deactivateMission: (_id: string) => Promise<void>
    
    findUserActiveMissions: (userId: string) => Promise<Mission[]>
    findUserParticipatingMissions: (userId: string) => Promise<Mission[]>
    findUserCompletedMissions: (userId: string) => Promise<Mission[]>
}