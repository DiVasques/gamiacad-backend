import { Reward } from '@/models/Reward'
import { ServiceToken } from '@/config/di'
import { IRewardRepository } from '@/repository/reward/IRewardRepository'
import { Inject, Service } from 'typedi'
import AppError from '@/models/error/AppError'
import ExceptionStatus from '@/utils/enum/ExceptionStatus'

@Service()
export class RewardService {
    @Inject(ServiceToken.rewardRepository)
    private rewardRepository: IRewardRepository

    async getRewards(filter: Partial<Reward>): Promise<Reward[]> {
        return await this.rewardRepository.find(filter)
    }

    async addReward(reward: Partial<Reward>) {
        await this.rewardRepository.create(reward)
    }

    async deleteReward(id: string) {
        let reward = await this.rewardRepository.findById(id)
        if (!reward) {
            throw new AppError(ExceptionStatus.notFound, 404)
        }
        if (reward.handed.length > 0) {
            throw new AppError(ExceptionStatus.invalidRequest, 400)
        }
        await this.rewardRepository.delete(id)
    }
}