import { Reward } from '@/models/Reward'
import { User } from '@/models/User'

export interface RewardWithUsers extends Reward {
    claimersInfo: User[]
    handedInfo: User[]
}