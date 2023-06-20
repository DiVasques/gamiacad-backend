import { Reward } from '@/models/Reward'

export interface IRewardRepository {
    findById: (id: string) => Promise<(Reward) | null>,
    findOne: (obj: any) => Promise<(Reward) | null>,
    find: (obj?: any) => Promise<Reward[]>

    create: (Reward: Partial<Reward>) => Promise<void>
    update(_id: string, data: Partial<Reward>, options?: object): Promise<void>
    delete: (_id: string) => Promise<void>
    findOneAndUpdate: (filter: Partial<Reward>, item: Partial<Reward>) => Promise<(Reward) | null>

}