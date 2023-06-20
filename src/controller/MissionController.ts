import { MissionService } from '@/services/MissionService'
import HttpRequest from '@/models/http/HttpRequest'
import HttpResponse from '@/models/http/HttpResponse'
import { Container } from 'typedi'

export class MissionController {
    static async getMissions(request: HttpRequest): Promise<HttpResponse> {
        const missionService = Container.get(MissionService)
        let missions = await missionService.getMissions(request.query)
        return new HttpResponse(200, { missions })
    }

    static async addMission(request: HttpRequest): Promise<HttpResponse> {
        const missionService = Container.get(MissionService)
        await missionService.addMission(request.body)
        return new HttpResponse(201)
    }

    static async deleteMission(request: HttpRequest): Promise<HttpResponse> {
        const missionService = Container.get(MissionService)
        await missionService.deleteMission(request.params.id)
        return new HttpResponse(202)
    }
}