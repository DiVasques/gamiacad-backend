import { SecureAuthService } from '@/services/auth/SecureAuthService'
import AppError from '@/models/error/AppError'

describe('SecureAuthService', () => {
    let secureAuthService: SecureAuthService
    let authRepositoryMock: any
    let refreshTokenRepositoryMock: any

    beforeEach(() => {
        authRepositoryMock = {
            giveAdminPrivileges: jest.fn().mockResolvedValue(1),
            revokeAdminPrivileges: jest.fn().mockResolvedValue(1)
        }
        refreshTokenRepositoryMock = {
            delete: jest.fn()
        }
        secureAuthService = new SecureAuthService()
        secureAuthService['authRepository'] = authRepositoryMock
        secureAuthService['refreshTokenRepository'] = refreshTokenRepositoryMock
    })

    afterEach(() =>
        jest.clearAllMocks()
    )

    describe('updateAdminPrivileges', () => {
        it('should give admin privileges to the user', async () => {
            // Arrange
            const id = '123'
            const admin = true

            // Act
            await secureAuthService.updateAdminPrivileges(id, admin)

            // Assert
            expect(authRepositoryMock.giveAdminPrivileges).toHaveBeenCalledWith(id)
            expect(authRepositoryMock.revokeAdminPrivileges).not.toBeCalled()
            expect(refreshTokenRepositoryMock.delete).toHaveBeenCalledWith(id)
        })

        it('should throw an error if cannot give admin privileges to the user', async () => {
            // Arrange
            const id = '123'
            const admin = true
            authRepositoryMock.giveAdminPrivileges.mockResolvedValue(0)
            let error

            // Act
            try {
                await secureAuthService.updateAdminPrivileges(id, admin)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).status).toBe(400)
            expect(authRepositoryMock.giveAdminPrivileges).toHaveBeenCalledWith(id)
            expect(authRepositoryMock.revokeAdminPrivileges).not.toBeCalled()
            expect(refreshTokenRepositoryMock.delete).not.toBeCalled()
        })

        it('should revoke admin privileges from the user', async () => {
            // Arrange
            const id = '123'
            const admin = false

            // Act
            await secureAuthService.updateAdminPrivileges(id, admin)

            // Assert
            expect(authRepositoryMock.giveAdminPrivileges).not.toBeCalled()
            expect(authRepositoryMock.revokeAdminPrivileges).toHaveBeenCalledWith(id)
            expect(refreshTokenRepositoryMock.delete).toHaveBeenCalledWith(id)
        })

        it('should throw an error if cannot revoke admin privileges from the user', async () => {
            // Arrange
            const id = '123'
            const admin = false
            authRepositoryMock.revokeAdminPrivileges.mockResolvedValue(0)
            let error

            // Act
            try {
                await secureAuthService.updateAdminPrivileges(id, admin)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).status).toBe(400)
            expect(authRepositoryMock.giveAdminPrivileges).not.toBeCalled()
            expect(authRepositoryMock.revokeAdminPrivileges).toHaveBeenCalledWith(id)
            expect(refreshTokenRepositoryMock.delete).not.toBeCalled()
        })
    })
})