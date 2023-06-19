import { MissionService } from '@/services/MissionService'
import HttpRequest from '@/models/http/HttpRequest'
import HttpResponse from '@/models/http/HttpResponse'
import { Container } from 'typedi'

export class MissionController {
    static async addMission(request: HttpRequest): Promise<HttpResponse> {
        const userService = Container.get(MissionService)
        await userService.addMission(request.body)
        return new HttpResponse(201)
    }
}