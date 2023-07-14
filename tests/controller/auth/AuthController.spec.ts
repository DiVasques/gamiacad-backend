import app from '@/app'
import request from 'supertest'
import { Container } from 'typedi'
import AppError from '@/models/error/AppError'
import ExceptionStatus from '@/utils/enum/ExceptionStatus'
import { defaultHeaders } from '../../mocks/DefaultHeaders'

describe('AuthController', () => {
    const authServiceMock = {
        registerUser: jest.fn().mockResolvedValue('token'),
        loginUser: jest.fn().mockResolvedValue('token')
    }

    beforeEach(() => {
        const containerMock = {
            get: jest.fn().mockReturnValue(authServiceMock),
        }
        Container.get = containerMock.get
    })

    afterEach(() =>
        jest.clearAllMocks()
    )

    const userRequest = { registration: '12345678901', password: 'Passw0rd!$!@#' }

    describe('registerUser', () => {
        it('should register and return the user token', async () => {
            // Act
            const { status, body } = await request(app)
                .post('/api/signup')
                .send(userRequest)
                .set(defaultHeaders)

            // Assert
            expect(status).toBe(201)
            expect(body.token).toEqual('token')
            expect(authServiceMock.registerUser).toHaveBeenCalledWith(userRequest)
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
            expect(authServiceMock.registerUser).toHaveBeenCalledWith(userRequest)
        })
    })

    describe('loginUser', () => {
        it('should register and return the user token', async () => {
            // Act
            const { status, body } = await request(app)
                .post('/api/login')
                .send(userRequest)
                .set(defaultHeaders)

            // Assert
            expect(status).toBe(200)
            expect(body.token).toEqual('token')
            expect(authServiceMock.loginUser).toHaveBeenCalledWith(userRequest)
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
            expect(authServiceMock.loginUser).toHaveBeenCalledWith(userRequest)
        })
    })
})
