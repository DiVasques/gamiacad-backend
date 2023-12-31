import { User } from '@/models/User'
import { ServiceToken } from '@/config/di'
import { IMissionRepository } from '@/repository/mission/IMissionRepository'
import { IRewardRepository } from '@/repository/reward/IRewardRepository'
import { IUserRepository } from '@/repository/user/IUserRepository'
import { Inject, Service } from 'typedi'
import AppError from '@/models/error/AppError'
import ExceptionStatus from '@/utils/enum/ExceptionStatus'
import { UserMissionsResult } from '@/ports/user/UserMissionsResult'
import { UserRewardsResult } from '@/ports/user/UserRewardsResult'
import { UserWithPrivilege } from '@/models/UserWithPrivilege'

@Service()
export class UserService {
    @Inject(ServiceToken.userRepository)
    private userRepository: IUserRepository
    @Inject(ServiceToken.missionRepository)
    private missionRepository: IMissionRepository
    @Inject(ServiceToken.rewardRepository)
    private rewardRepository: IRewardRepository

    async getUsers(filter: Partial<User>): Promise<UserWithPrivilege[]> {
        return await this.userRepository.getUsersWithPrivilege(filter)
    }

    async getUserById(id: string): Promise<User> {
        const user = await this.userRepository.findById(id)
        if (!user) {
            throw new AppError(ExceptionStatus.notFound, 404)
        }
        return user
    }

    async addUser(user: Partial<User>) {
        await this.userRepository.create(user)
    }

    async deleteUser(id: string) {
        const user = await this.userRepository.findById(id)
        if (!user) {
            throw new AppError(ExceptionStatus.notFound, 404)
        }
        await this.userRepository.delete(id)
    }

    async getUserMissions(id: string): Promise<UserMissionsResult> {
        const user = await this.userRepository.findById(id)
        if (!user) {
            throw new AppError(ExceptionStatus.notFound, 404)
        }
        const [activeMissions, participatingMissions, completedMissions] = await Promise.all(
            [
                this.missionRepository.findUserActiveMissions(id),
                this.missionRepository.findUserParticipatingMissions(id),
                this.missionRepository.findUserCompletedMissions(id)
            ]
        )
        return {
            active: activeMissions,
            participating: participatingMissions,
            completed: completedMissions
        }
    }

    async getUserRewards(id: string): Promise<UserRewardsResult> {
        const user = await this.userRepository.findById(id)
        if (!user) {
            throw new AppError(ExceptionStatus.notFound, 404)
        }
        const [availableRewards, claimedRewards, receivedRewards] = await Promise.all(
            [
                this.rewardRepository.findUserAvailableRewards(id),
                this.rewardRepository.findUserClaimedRewards(id),
                this.rewardRepository.findUserHandedRewards(id)
            ]
        )
        return {
            balance: user.balance,
            available: availableRewards,
            claimed: claimedRewards,
            received: receivedRewards
        }
    }
}