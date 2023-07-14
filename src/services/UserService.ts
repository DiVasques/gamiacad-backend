import { Mission } from '@/models/Mission'
import { Reward } from '@/models/Reward'
import { User } from '@/models/User'
import { ServiceToken } from '@/config/di'
import { IMissionRepository } from '@/repository/mission/IMissionRepository'
import { IRewardRepository } from '@/repository/reward/IRewardRepository'
import { IUserRepository } from '@/repository/user/IUserRepository'
import { Inject, Service } from 'typedi'
import AppError from '@/models/error/AppError'
import ExceptionStatus from '@/utils/enum/ExceptionStatus'
import { UserMission } from '@/models/UserMission'
import { UserReward } from '@/models/UserReward'

@Service()
export class UserService {
    @Inject(ServiceToken.userRepository)
    private userRepository: IUserRepository
    @Inject(ServiceToken.missionRepository)
    private missionRepository: IMissionRepository
    @Inject(ServiceToken.rewardRepository)
    private rewardRepository: IRewardRepository

    async getUsers(filter: Partial<User>): Promise<User[]> {
        return await this.userRepository.find(filter)
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
        await this.userRepository.delete(id)
    }

    async getUserMissions(id: string): Promise<{ active: UserMission[], participating: UserMission[], completed: UserMission[] }> {
        const [activeMissions, participatingMissions, completedMissions] = await Promise.all(
            [
                this.missionRepository.findUserActiveMissions(id),
                this.missionRepository.findUserParticipatingMissions(id),
                this.missionRepository.findUserCompletedMissions(id)
            ]
        )
        return {
            active: activeMissions.map(this.parseMission),
            participating: participatingMissions.map(this.parseMission),
            completed: completedMissions.map(this.parseMission)
        }
    }

    async getUserRewards(id: string): Promise<{ available: UserReward[], claimed: UserReward[], received: UserReward[] }> {
        const [availableRewards, claimedRewards, receivedRewards] = await Promise.all(
            [
                this.rewardRepository.findAvailableRewards(id),
                this.rewardRepository.findClaimedRewards(id),
                this.rewardRepository.findHandedRewards(id)
            ]
        )
        return {
            available: availableRewards.map(this.parseReward),
            claimed: claimedRewards.map((reward) => this.parseRewardWithCount(id, reward, 'claimers')),
            received: receivedRewards.map((reward) => this.parseRewardWithCount(id, reward, 'handed'))
        }
    }

    private parseMission(mission: Mission): UserMission {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { participants, completers, ...parsedMission } = mission
        return parsedMission
    }

    private parseReward(reward: Reward): UserReward {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { claimers, handed, ...parsedReward } = reward
        return parsedReward
    }

    private parseRewardWithCount(id: string, reward: Reward, arrayToCount: 'claimers' | 'handed'): UserReward {
        return {
            ...this.parseReward(reward),
            count: reward[arrayToCount].reduce((count, userId) => {
                if (userId === id) {
                    return count + 1
                }
                return count
            }, 0)
        }
    }
}