import { Mission } from '@/models/Mission'
import { ServiceToken } from '@/config/di'
import { IMissionRepository } from '@/repository/mission/IMissionRepository'
import { Inject, Service } from 'typedi'
import AppError from '@/models/error/AppError'
import ExceptionStatus from '@/utils/enum/ExceptionStatus'

@Service()
export class MissionService {
    @Inject(ServiceToken.missionRepository)
    private missionRepository: IMissionRepository

    async getMissions(filter: Partial<Mission>): Promise<Mission[]> {
        return await this.missionRepository.find(filter)
    }

    async addMission(mission: Partial<Mission>) {
        await this.missionRepository.create(mission)
    }

    async deleteMission(id: string) {
        let mission = await this.missionRepository.findById(id)
        if (!mission) {
            throw new AppError(ExceptionStatus.notFound, 404)
        }
        if (mission.completers.length > 0) {
            throw new AppError(ExceptionStatus.invalidRequest, 400)
        }
        await this.missionRepository.delete(id)
    }
}