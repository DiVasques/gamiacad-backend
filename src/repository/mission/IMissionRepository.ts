import { Mission } from '@/models/Mission'

export interface IMissionRepository {
    findById: (id: string) => Promise<(Mission) | null>,
    findOne: (obj: any) => Promise<(Mission) | null>,
    find: (obj?: any) => Promise<Mission[]>

    create: (Mission: Partial<Mission>) => Promise<void>
    update(_id: string, data: Partial<Mission>, options?: Object): Promise<void>
    delete: (_id: string) => Promise<void>
    findOneAndUpdate: (filter: Partial<Mission>, item: Partial<Mission>) => Promise<(Mission) | null>

}