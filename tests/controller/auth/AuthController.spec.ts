import app from '@/app'
import request from 'supertest'
import { Container } from 'typedi'
import AppError from '@/models/error/AppError'
import ExceptionStatus from '@/utils/enum/ExceptionStatus'
import { defaultHeaders } from '../../mocks/DefaultHeaders'
import { AuthResult } from '@/ports/auth/AuthResult'

describe('AuthController', () => {
    const authResult: AuthResult = {
        userId: 'a047efa6-d3b5-499d-8b47-5b59dc61ab32',
        accessToken: 'access-token',
        refreshToken: 'refresh-token'
    }
    const authServiceMock = {
        registerUser: jest.fn().mockResolvedValue(authResult),
        loginUser: jest.fn().mockResolvedValue(authResult),
        refreshToken: jest.fn().mockResolvedValue(authResult),
        logoutUser: jest.fn()
    }

    beforeEach(() => {
        const containerMock = {
            get: jest.fn().mockReturnValue(authServiceMock),
        }
        Container.get = containerMock.get
        app.enable('trust proxy')
    })

    afterEach(() =>
        jest.clearAllMocks()
    )

    const userRequest = { registration: '12345678901', password: 'Passw0rd!$!@#' }
    const refreshTokenRequest = { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' }

    describe('registerUser', () => {
        it('should register and return the user tokens', async () => {
            // Act
            const { status, body }: { status: number, body: AuthResult } = await request(app)
                .post('/api/signup')
                .send(userRequest)
                .set(defaultHeaders)

            // Assert
            expect(status).toBe(201)
            expect(body.accessToken).toEqual('access-token')
            expect(body.refreshToken).toEqual('refresh-token')
            expect(body.userId).toEqual('a047efa6-d3b5-499d-8b47-5b59dc61ab32')
            expect(authServiceMock.registerUser).toHaveBeenCalledWith(userRequest, defaultHeaders['X-Forwarded-For'])
        })

        it('should return 409 if user already registered', async () => {
            // Arrange
            authServiceMock.registerUser.mockRejectedValueOnce(new AppError(ExceptionStatus.accountExists, 409))

            // Act
            const { status } = await request(app)
                .post('/api/signup')
                .send(userRequest)
                .set(defaultHeaders)

            // Assert
            expect(status).toBe(409)
            expect(authServiceMock.registerUser).toHaveBeenCalledWith(userRequest, defaultHeaders['X-Forwarded-For'])
        })
    })

    describe('loginUser', () => {
        it('should login and return the user tokens', async () => {
            // Act
            const { status, body }: { status: number, body: AuthResult } = await request(app)
                .post('/api/login')
                .send(userRequest)
                .set(defaultHeaders)

            // Assert
            expect(status).toBe(200)
            expect(body.accessToken).toEqual('access-token')
            expect(body.refreshToken).toEqual('refresh-token')
            expect(body.userId).toEqual('a047efa6-d3b5-499d-8b47-5b59dc61ab32')
            expect(authServiceMock.loginUser).toHaveBeenCalledWith(userRequest, defaultHeaders['X-Forwarded-For'])
        })

        it('should return 401 if invalid credentials', async () => {
            // Arrange
            authServiceMock.loginUser.mockRejectedValueOnce(new AppError(ExceptionStatus.invalidCredentials, 401))

            // Act
            const { status } = await request(app)
                .post('/api/login')
                .send(userRequest)
                .set(defaultHeaders)

            // Assert
            expect(status).toBe(401)
            expect(authServiceMock.loginUser).toHaveBeenCalledWith(userRequest, defaultHeaders['X-Forwarded-For'])
        })
    })

    describe('refreshUserTokens', () => {
        it('should refresh and return the user tokens', async () => {
            // Act
            const { status, body }: { status: number, body: AuthResult } = await request(app)
                .post('/api/login/refresh')
                .send(refreshTokenRequest)
                .set(defaultHeaders)

            // Assert
            expect(status).toBe(200)
            expect(body.accessToken).toEqual('access-token')
            expect(body.refreshToken).toEqual('refresh-token')
            expect(body.userId).toEqual('a047efa6-d3b5-499d-8b47-5b59dc61ab32')
            expect(authServiceMock.refreshToken).toHaveBeenCalledWith(refreshTokenRequest.token, defaultHeaders['X-Forwarded-For'])
        })

        it('should return 401 if invalid token', async () => {
            // Arrange
            authServiceMock.refreshToken.mockRejectedValueOnce(new AppError(ExceptionStatus.invalidToken, 401))

            // Act
            const { status } = await request(app)
                .post('/api/login/refresh')
                .send(refreshTokenRequest)
                .set(defaultHeaders)

            // Assert
            expect(status).toBe(401)
            expect(authServiceMock.refreshToken).toHaveBeenCalledWith(refreshTokenRequest.token, defaultHeaders['X-Forwarded-For'])
        })
    })

    describe('logoutUser', () => {
        it('should logout the user', async () => {
            // Act
            const { status } = await request(app)
                .post('/api/logout')
                .send(refreshTokenRequest)
                .set(defaultHeaders)

            // Assert
            expect(status).toBe(204)
            expect(authServiceMock.logoutUser).toHaveBeenCalledWith(refreshTokenRequest.token, defaultHeaders['X-Forwarded-For'])
        })

        it('should return 401 if invalid token', async () => {
            // Arrange
            authServiceMock.logoutUser.mockRejectedValueOnce(new AppError(ExceptionStatus.invalidToken, 401))

            // Act
            const { status } = await request(app)
                .post('/api/logout')
                .send(refreshTokenRequest)
                .set(defaultHeaders)

            // Assert
            expect(status).toBe(401)
            expect(authServiceMock.logoutUser).toHaveBeenCalledWith(refreshTokenRequest.token, defaultHeaders['X-Forwarded-For'])
        })
    })
})
