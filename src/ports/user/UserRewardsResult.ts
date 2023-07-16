import { UserReward } from '@/ports/user/UserReward';

export interface UserRewardsResult {
    available: UserReward[],
    claimed: UserReward[],
    received: UserReward[]
}