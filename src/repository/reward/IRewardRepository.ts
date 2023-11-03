import { Reward } from '@/models/Reward'
import { RewardWithUsers } from '@/models/RewardWithUsers'

export interface IRewardRepository {
    findById: (id: string) => Promise<(Reward) | null>,
    findOne: (obj: any) => Promise<(Reward) | null>,
    find: (obj?: any) => Promise<Reward[]>

    create: (Reward: Partial<Reward>) => Promise<void>
    update(_id: string, data: Partial<Reward>, options?: object): Promise<void>
    findOneAndUpdate: (filter: Partial<Reward>, item: Partial<Reward>) => Promise<(Reward) | null>

    getRewardsWithUsers: (filter: Partial<Reward>) => Promise<RewardWithUsers[]>

    claimReward: (_id: string, userId: string) => Promise<number>
    rollbackClaim: (_id: string, userId: string) => Promise<number>
    handReward: (_id: string, userId: string) => Promise<number>
    deactivateReward: (_id: string) => Promise<number>
    
    findAvailableRewards: (userId: string) => Promise<Reward[]>
    findClaimedRewards: (userId: string) => Promise<Reward[]>
    findHandedRewards: (userId: string) => Promise<Reward[]>
}