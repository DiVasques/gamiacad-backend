import app from '@/app'
import request from 'supertest'
import { Container } from 'typedi'
import AppError from '@/models/error/AppError'
import ExceptionStatus from '@/utils/enum/ExceptionStatus'
import { defaultHeaders } from '../../mocks/DefaultHeaders'

describe('AuthController', () => {
    const authServiceMock = {
        registerUser: jest.fn().mockResolvedValue('token')
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

    const newUser = { registration: '12345678901', password: 'Passw0rd!$!@#' }

    describe('registerUser', () => {
        it('should register and return the user token', async () => {
            // Act
            const { status, body } = await request(app)
                .post('/api/signup')
                .send(newUser)
                .set(defaultHeaders)

            // Assert
            expect(status).toBe(201)
            expect(body.token).toEqual('token')
            expect(authServiceMock.registerUser).toHaveBeenCalledWith(newUser)
        })

        it('should return 409 if user already registered', async () => {
            // Arrange
            authServiceMock.registerUser.mockRejectedValueOnce(new AppError(ExceptionStatus.accountExists, 409))

            // Act
            const { status } = await request(app)
                .post('/api/signup')
                .send(newUser)
                .set(defaultHeaders)

            // Assert
            expect(status).toBe(409)
            expect(authServiceMock.registerUser).toHaveBeenCalledWith(newUser)
        })
    })
})
