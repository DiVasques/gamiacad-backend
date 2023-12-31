import { Mission } from '@/models/Mission'
import { ServiceToken } from '@/config/di'
import { IMissionRepository } from '@/repository/mission/IMissionRepository'
import { IUserRepository } from '@/repository/user/IUserRepository'
import { Inject, Service } from 'typedi'
import AppError from '@/models/error/AppError'
import ExceptionStatus from '@/utils/enum/ExceptionStatus'
import { EditMission } from '@/ports/mission/EditMission'
import { MissionWithUsers } from '@/models/MissionWithUsers'

@Service()
export class MissionService {
    @Inject(ServiceToken.userRepository)
    private userRepository: IUserRepository
    @Inject(ServiceToken.missionRepository)
    private missionRepository: IMissionRepository

    async getMission(id: string): Promise<Mission> {
        const mission = await this.missionRepository.getMissionByIdWithUsers(id)
        if (!mission) {
            throw new AppError(ExceptionStatus.notFound, 404)
        }
        return mission
    }

    async getMissions(filter: Partial<Mission>): Promise<MissionWithUsers[]> {
        return await this.missionRepository.getMissionsWithUsers(filter)
    }

    async addMission(mission: Partial<Mission>, createdBy: string) {
        await this.missionRepository.create({ ...mission, createdBy: createdBy })
    }

    async editMission(id: string, editMission: EditMission) {
        const mission = await this.missionRepository.findById(id)
        if (!mission) {
            throw new AppError(ExceptionStatus.notFound, 404)
        }
        if (!!editMission.expirationDate && mission.expirationDate > editMission.expirationDate) {
            throw new AppError(ExceptionStatus.invalidExpirationDate, 400)
        }
        await this.missionRepository.update(id, editMission)
    }

    async deactivateMission(id: string) {
        const mission = await this.missionRepository.findById(id)
        if (!mission) {
            throw new AppError(ExceptionStatus.notFound, 404)
        }
        await this.missionRepository.deactivateMission(id)
    }

    async subscribeUser(id: string, userId: string, createdBy: string) {
        const [user, mission] = await Promise.all([this.userRepository.findById(userId), this.missionRepository.findById(id)])
        if (!user) {
            throw new AppError(ExceptionStatus.notFound, 404)
        }
        if (!mission) {
            throw new AppError(ExceptionStatus.notFound, 404)
        }
        const modifiedCount = await this.missionRepository.subscribeUser(id, userId, createdBy)
        if (modifiedCount === 0) {
            throw new AppError(ExceptionStatus.alreadySubscribed, 400)
        }
    }

    async completeMission(id: string, userId: string, createdBy: string) {
        const [user, mission] = await Promise.all([this.userRepository.findById(userId), this.missionRepository.findById(id)])
        if (!user) {
            throw new AppError(ExceptionStatus.notFound, 404)
        }
        if (!mission) {
            throw new AppError(ExceptionStatus.notFound, 404)
        }
        const modifiedCount = await this.missionRepository.completeMission(id, userId, createdBy)
        if (modifiedCount === 0) {
            throw new AppError(ExceptionStatus.cantCompleteMission, 400)
        }
        await this.userRepository.givePoints(userId, mission.points)
    }
}