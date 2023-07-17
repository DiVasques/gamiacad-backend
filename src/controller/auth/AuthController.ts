import { AuthService } from '@/services/auth/AuthService'
import HttpRequest from '@/ports/http/HttpRequest'
import HttpResponse from '@/ports/http/HttpResponse'
import { Container } from 'typedi'

export class AuthController {
    static async registerUser(request: HttpRequest): Promise<HttpResponse> {
        const authService = Container.get(AuthService)
        const result = await authService.registerUser(request.body, request.ip)
        return new HttpResponse(201, result)
    }

    static async loginUser(request: HttpRequest): Promise<HttpResponse> {
        const authService = Container.get(AuthService)
        const result = await authService.loginUser(request.body, request.ip)
        return new HttpResponse(200, result)
    }

    static async refreshToken(request: HttpRequest): Promise<HttpResponse> {
        const authService = Container.get(AuthService)
        const result = await authService.refreshToken(request.body.token, request.ip)
        return new HttpResponse(200, result)
    }
}