import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { AuthService } from '@/services/auth/AuthService'
import { userAuth } from '../../mocks/UserAuth'
import AppError from '@/models/error/AppError'
import ExceptionStatus from '@/utils/enum/ExceptionStatus'
import { TokenPayload } from '@/models/auth/TokenPayload'

describe('AuthService', () => {
    let authService: AuthService
    let authRepositoryMock: any

    beforeEach(() => {
        authRepositoryMock = {
            findById: jest.fn(),
            registerUser: jest.fn().mockResolvedValue(userAuth)
        }
        authService = new AuthService()
        authService['authRepository'] = authRepositoryMock
        process.env.TOKEN_SECRET = 'your-token-secret'
    })

    afterEach(() =>
        jest.clearAllMocks()
    )

    const newUser = { registration: '12345678901', password: 'Passw0rd!$!@#' }

    describe('registerUser', () => {
        it('should register and return the user token', async () => {
            // Arrange
            jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashed-password' as never)
            const signMock = jest.spyOn(jwt, 'sign').mockReturnValueOnce('jwt-token' as never)

            // Act
            const result = await authService.registerUser(newUser)

            // Assert
            expect(authRepositoryMock.findById).toHaveBeenCalledWith(newUser.registration)
            expect(authRepositoryMock.registerUser).toHaveBeenCalledWith({
                _id: newUser.registration,
                password: 'hashed-password',
            })
            expect(signMock).toHaveBeenCalledWith(
                { sub: userAuth.uuid, roles: userAuth.roles } as TokenPayload,
                'your-token-secret',
                { expiresIn: '30s' }
            )
            expect(result.accessToken).toBe('jwt-token')
            expect(result.userId).toBe(userAuth.uuid)
        })

        it('should throw an error if TOKEN_SECRET env is not set', async () => {
            // Arrange
            delete process.env.TOKEN_SECRET
            let error

            // Act
            try {
                await authService.registerUser(newUser)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).message).toBe(ExceptionStatus.serviceUnavailable)
            expect((error as AppError).status).toBe(503)
            expect(authRepositoryMock.findById).not.toBeCalled()
            expect(authRepositoryMock.registerUser).not.toBeCalled()
        })

        it('should throw 409 if user already registered', async () => {
            // Arrange
            let error
            authRepositoryMock.findById.mockResolvedValueOnce(userAuth)

            // Act
            try {
                await authService.registerUser(newUser)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).message).toBe(ExceptionStatus.accountExists)
            expect((error as AppError).status).toBe(409)
            expect(authRepositoryMock.findById).toHaveBeenCalledWith(newUser.registration)
            expect(authRepositoryMock.registerUser).not.toBeCalled()
        })
    })

    describe('loginUser', () => {
        it('should return the user token', async () => {
            // Arrange
            authRepositoryMock.findById.mockResolvedValueOnce(userAuth)
            jest.spyOn(bcrypt, 'compareSync').mockReturnValueOnce(true as never)
            const signMock = jest.spyOn(jwt, 'sign').mockReturnValueOnce('jwt-token' as never)

            // Act
            const result = await authService.loginUser(newUser)

            // Assert
            expect(authRepositoryMock.findById).toHaveBeenCalledWith(newUser.registration)
            expect(signMock).toHaveBeenCalledWith(
                { sub: userAuth.uuid, roles: userAuth.roles } as TokenPayload,
                'your-token-secret',
                { expiresIn: '30s' }
            )
            expect(result.accessToken).toBe('jwt-token')
            expect(result.userId).toBe(userAuth.uuid)
        })

        it('should throw an error if TOKEN_SECRET env is not set', async () => {
            // Arrange
            delete process.env.TOKEN_SECRET
            let error

            // Act
            try {
                await authService.loginUser(newUser)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).message).toBe(ExceptionStatus.serviceUnavailable)
            expect((error as AppError).status).toBe(503)
            expect(authRepositoryMock.findById).not.toBeCalled()
        })

        it('should throw 401 if user does not exists', async () => {
            // Arrange
            let error

            // Act
            try {
                await authService.loginUser(newUser)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).message).toBe(ExceptionStatus.invalidCredentials)
            expect((error as AppError).status).toBe(401)
            expect(authRepositoryMock.findById).toHaveBeenCalledWith(newUser.registration)
        })

        it('should throw 401 if password does not match', async () => {
            // Arrange
            authRepositoryMock.findById.mockResolvedValueOnce(userAuth)
            jest.spyOn(bcrypt, 'compareSync').mockReturnValueOnce(false as never)
            let error

            // Act
            try {
                await authService.loginUser(newUser)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).message).toBe(ExceptionStatus.invalidCredentials)
            expect((error as AppError).status).toBe(401)
            expect(authRepositoryMock.findById).toHaveBeenCalledWith(newUser.registration)
        })
    })
})