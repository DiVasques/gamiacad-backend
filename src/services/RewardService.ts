import { Reward } from '@/models/Reward'
import { ServiceToken } from '@/config/di'
import { IRewardRepository } from '@/repository/reward/IRewardRepository'
import { IUserRepository } from '@/repository/user/IUserRepository'
import { Inject, Service } from 'typedi'
import AppError from '@/models/error/AppError'
import ExceptionStatus from '@/utils/enum/ExceptionStatus'

@Service()
export class RewardService {
    @Inject(ServiceToken.rewardRepository)
    private rewardRepository: IRewardRepository
    @Inject(ServiceToken.userRepository)
    private userRepository: IUserRepository

    async getRewards(filter: Partial<Reward>): Promise<Reward[]> {
        return await this.rewardRepository.find(filter)
    }

    async addReward(reward: Partial<Reward>) {
        await this.rewardRepository.create(reward)
    }

    async deleteReward(id: string) {
        const reward = await this.rewardRepository.findById(id)
        if (!reward) {
            throw new AppError(ExceptionStatus.notFound, 404)
        }
        if (reward.handed.length > 0) {
            throw new AppError(ExceptionStatus.invalidRequest, 400)
        }
        await this.rewardRepository.delete(id)
    }

    async claimReward(id: string, userId: string) {
        const [user, reward] = await Promise.all([this.userRepository.findById(userId), this.rewardRepository.findById(id)])
        if (!user) {
            throw new AppError(ExceptionStatus.notFound, 404)
        }
        if (!reward) {
            throw new AppError(ExceptionStatus.notFound, 404)
        }
        if (user.balance < reward.price) {
            throw new AppError(ExceptionStatus.insufficientBalance, 400)
        }
        let modifiedCount = await this.rewardRepository.claimReward(id, userId)
        if (modifiedCount === 0) {
            throw new AppError(ExceptionStatus.rewardUnavailable, 400)
        }
        modifiedCount = await this.userRepository.withdrawPoints(userId, reward.price)
        if (modifiedCount === 0) {
            await this.rewardRepository.rollbackClaim(id, userId)
            throw new AppError(ExceptionStatus.insufficientBalance, 400)
        }
    }

    async handReward(id: string, userId: string) {
        const [user, reward] = await Promise.all([this.userRepository.findById(userId), this.rewardRepository.findById(id)])
        if (!user) {
            throw new AppError(ExceptionStatus.notFound, 404)
        }
        if (!reward) {
            throw new AppError(ExceptionStatus.notFound, 404)
        }
        const modifiedCount = await this.rewardRepository.handReward(id, userId)
        if (modifiedCount === 0) {
            throw new AppError(ExceptionStatus.cantHandReward, 400)
        }
    }
}