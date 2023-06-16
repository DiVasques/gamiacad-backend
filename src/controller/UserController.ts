import { UserService } from "@/services/UserService";
import HttpRequest from "@/utils/http/HttpRequest";
import HttpResponse from "@/utils/http/HttpResponse";
import { Container } from "typedi";

export class UserController {
    static async getUsers(request: HttpRequest): Promise<HttpResponse> {
        const userService = Container.get(UserService);
        let users = await userService.getUsers(request.query)
        return new HttpResponse(200, { users })
    }
}