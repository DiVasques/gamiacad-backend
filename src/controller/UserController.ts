import { UserService } from '@/services/UserService';
import HttpRequest from '@/models/http/HttpRequest';
import HttpResponse from '@/models/http/HttpResponse';
import { Container } from 'typedi';

export class UserController {
    static async getUsers(request: HttpRequest): Promise<HttpResponse> {
        const userService = Container.get(UserService);
        let users = await userService.getUsers(request.query)
        return new HttpResponse(200, { users })
    }

    static async addUser(request: HttpRequest): Promise<HttpResponse> {
        const userService = Container.get(UserService);
        await userService.addUser(request.body)
        return new HttpResponse(201)
    }
}