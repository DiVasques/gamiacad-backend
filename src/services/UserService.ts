import { Mission } from '@/models/Mission'
import { User } from '@/models/User'
import { ServiceToken } from '@/config/di'
import { IMissionRepository } from '@/repository/mission/IMissionRepository'
import { IUserRepository } from '@/repository/user/IUserRepository'
import { Inject, Service } from 'typedi'
import AppError from '@/models/error/AppError'
import ExceptionStatus from '@/utils/enum/ExceptionStatus'
import { UserMission } from '@/models/UserMission'

@Service()
export class UserService {
    @Inject(ServiceToken.userRepository)
    private userRepository: IUserRepository
    @Inject(ServiceToken.missionRepository)
    private missionRepository: IMissionRepository

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

    async getUserMissions(id: string): Promise<{ active: UserMission[], completed: UserMission[] }> {
        const [activeMissions, completedMissions] = await Promise.all(
            [this.missionRepository.findActiveMissions(id), this.missionRepository.findUserCompletedMissions(id)]
        )
        return {
            active: activeMissions.map(mission => this.parseActiveMission(id, mission)),
            completed: completedMissions.map(this.parseMission)
        }
    }

    private parseMission(mission: Mission): UserMission {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { participants, completers, ...parsedMission } = mission;
        return parsedMission;
    }

    private parseActiveMission(id: string, mission: Mission): UserMission {
        return {
            ...this.parseMission(mission),
            participating: mission.participants.includes(id)
        }
    }
}