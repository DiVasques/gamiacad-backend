import { MissionService } from '@/services/MissionService'
import HttpRequest from '@/ports/http/HttpRequest'
import HttpResponse from '@/ports/http/HttpResponse'
import { Container } from 'typedi'

export class MissionController {
    static async getMissions(request: HttpRequest): Promise<HttpResponse> {
        const missionService = Container.get(MissionService)
        const missions = await missionService.getMissions(request.query)
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
        return new HttpResponse(204)
    }

    static async subscribeUser(request: HttpRequest): Promise<HttpResponse> {
        const missionService = Container.get(MissionService)
        const {id, userId} = request.params
        await missionService.subscribeUser(id, userId)
        return new HttpResponse(204)
    }

    static async completeMission(request: HttpRequest): Promise<HttpResponse> {
        const missionService = Container.get(MissionService)
        const {id, userId} = request.params
        await missionService.completeMission(id, userId)
        return new HttpResponse(204)
    }
}