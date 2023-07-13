import { Reward } from '@/models/Reward';

export interface UserReward extends Omit<Reward, 'claimers' | 'handed'> {
    count?: number
}