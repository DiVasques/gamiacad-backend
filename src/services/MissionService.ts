import { Mission } from '@/models/Mission'
import { ServiceToken } from '@/config/di'
import { IMissionRepository } from '@/repository/mission/IMissionRepository'
import { Inject, Service } from 'typedi'

@Service()
export class MissionService {
    @Inject(ServiceToken.missionRepository)
    private missionRepository: IMissionRepository

    async addMission(mission: Partial<Mission>) {
        await this.missionRepository.create(mission)
    }
}