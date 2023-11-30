import HttpRequest from '@/ports/http/HttpRequest'
import HttpResponse from '@/ports/http/HttpResponse'
import { Container } from 'typedi'
import { SecureAuthService } from '@/services/auth/SecureAuthService'

export class SecureAuthController {
    static async updateUserStatus(request: HttpRequest): Promise<HttpResponse> {
        const secureAuthService = Container.get(SecureAuthService)
        await secureAuthService.updateUserStatus(request.params.id, request.body.active)
        return new HttpResponse(204)
    }

    static async updateAdminPrivileges(request: HttpRequest): Promise<HttpResponse> {
        const secureAuthService = Container.get(SecureAuthService)
        await secureAuthService.updateAdminPrivileges(request.params.id, request.body.admin)
        return new HttpResponse(204)
    }
}