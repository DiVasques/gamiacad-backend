import { UserService } from '@/services/UserService'
import HttpRequest from '@/ports/http/HttpRequest'
import HttpResponse from '@/ports/http/HttpResponse'
import { Container } from 'typedi'

export class UserController {
    static async getUsers(request: HttpRequest): Promise<HttpResponse> {
        const userService = Container.get(UserService)
        const users = await userService.getUsers(request.query)
        return new HttpResponse(200, { users })
    }

    static async getUserById(request: HttpRequest): Promise<HttpResponse> {
        const userService = Container.get(UserService)
        const user = await userService.getUserById(request.params.id)
        return new HttpResponse(200, { ...user })
    }

    static async getUserMissions(request: HttpRequest): Promise<HttpResponse> {
        const userService = Container.get(UserService)
        const missions = await userService.getUserMissions(request.params.id)
        return new HttpResponse(200, { ...missions })
    }

    static async getUserRewards(request: HttpRequest): Promise<HttpResponse> {
        const userService = Container.get(UserService)
        const rewards = await userService.getUserRewards(request.params.id)
        return new HttpResponse(200, { ...rewards })
    }

    static async addUser(request: HttpRequest): Promise<HttpResponse> {
        const userService = Container.get(UserService)
        await userService.addUser({ _id: request.params.id, ...request.body })
        return new HttpResponse(201)
    }

    static async deleteUser(request: HttpRequest): Promise<HttpResponse> {
        const userService = Container.get(UserService)
        await userService.deleteUser(request.params.id)
        return new HttpResponse(204)
    }
}