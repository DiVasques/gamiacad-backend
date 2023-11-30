import { Reward } from '@/models/Reward'
import { ServiceToken } from '@/config/di'
import { IRewardRepository } from '@/repository/reward/IRewardRepository'
import { IUserRepository } from '@/repository/user/IUserRepository'
import { Inject, Service } from 'typedi'
import AppError from '@/models/error/AppError'
import ExceptionStatus from '@/utils/enum/ExceptionStatus'
import { EditReward } from '@/ports/reward/EditReward'
import { ClaimedReward } from '@/models/ClaimedReward'

@Service()
export class RewardService {
    @Inject(ServiceToken.rewardRepository)
    private rewardRepository: IRewardRepository
    @Inject(ServiceToken.userRepository)
    private userRepository: IUserRepository

    async getReward(id: string): Promise<Reward> {
        const reward = await this.rewardRepository.getRewardByIdWithUsers(id)
        if (!reward) {
            throw new AppError(ExceptionStatus.notFound, 404)
        }
        return reward
    }

    async getRewards(filter: Partial<Reward>): Promise<Reward[]> {
        return await this.rewardRepository.getRewardsWithUsers(filter)
    }

    async getClaimedRewards(): Promise<ClaimedReward[]> {
        return await this.rewardRepository.findClaimedRewards()
    }

    async addReward(reward: Partial<Reward>) {
        await this.rewardRepository.create(reward)
    }

    async editReward(id: string, editReward: EditReward) {
        const reward = await this.rewardRepository.findById(id)
        if (!reward) {
            throw new AppError(ExceptionStatus.notFound, 404)
        }
        await this.rewardRepository.update(id, editReward)
    }

    async deactivateReward(id: string) {
        const reward = await this.rewardRepository.findById(id)
        if (!reward) {
            throw new AppError(ExceptionStatus.notFound, 404)
        }
        const modifiedCount = await this.rewardRepository.deactivateReward(id)
        if (modifiedCount === 0) {
            throw new AppError(ExceptionStatus.rewardAlreadyInactive, 400)
        }
        await Promise.all(reward.claimers.map(userAction => {
            this.rewardRepository.rollbackClaim(id, userAction.id)
            this.userRepository.givePoints(userAction.id, reward.price, true)
        }))
    }

    async claimReward(id: string, userId: string, createdBy: string) {
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
        let modifiedCount = await this.rewardRepository.claimReward(id, userId, createdBy)
        if (modifiedCount === 0) {
            throw new AppError(ExceptionStatus.rewardUnavailable, 400)
        }
        modifiedCount = await this.userRepository.withdrawPoints(userId, reward.price)
        if (modifiedCount === 0) {
            await this.rewardRepository.rollbackClaim(id, userId)
            throw new AppError(ExceptionStatus.insufficientBalance, 400)
        }
    }

    async handReward(id: string, userId: string, createdBy: string) {
        const [user, reward] = await Promise.all([this.userRepository.findById(userId), this.rewardRepository.findById(id)])
        if (!user) {
            throw new AppError(ExceptionStatus.notFound, 404)
        }
        if (!reward) {
            throw new AppError(ExceptionStatus.notFound, 404)
        }
        const modifiedCount = await this.rewardRepository.handReward(id, userId, createdBy)
        if (modifiedCount === 0) {
            throw new AppError(ExceptionStatus.cantHandOrCancelReward, 400)
        }
    }

    async cancelClaim(id: string, userId: string) {
        const [user, reward] = await Promise.all([this.userRepository.findById(userId), this.rewardRepository.findById(id)])
        if (!user) {
            throw new AppError(ExceptionStatus.notFound, 404)
        }
        if (!reward) {
            throw new AppError(ExceptionStatus.notFound, 404)
        }
        const modifiedCount = await this.rewardRepository.rollbackClaim(id, userId)
        if (modifiedCount === 0) {
            throw new AppError(ExceptionStatus.cantHandOrCancelReward, 400)
        }
        await this.userRepository.givePoints(userId, reward.price, true)
    }
}