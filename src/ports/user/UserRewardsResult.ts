import { UserReward } from '@/models/UserReward'

export interface UserRewardsResult {
    balance: number,
    available: UserReward[],
    claimed: UserReward[],
    received: UserReward[]
}