import { AuthService } from '@/services/auth/AuthService'
import HttpRequest from '@/models/http/HttpRequest'
import HttpResponse from '@/models/http/HttpResponse'
import { Container } from 'typedi'

export class AuthController {
    static async registerUser(request: HttpRequest): Promise<HttpResponse> {
        const authService = Container.get(AuthService)
        const token = await authService.registerUser(request.body)
        return new HttpResponse(201, { token })
    }
}