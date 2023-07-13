import app from '@/app'
import request from 'supertest'
import { user, userList } from '../mocks/User'
import { userMissions } from '../mocks/Mission'
import { userRewards } from '../mocks/Reward'
import { Container } from 'typedi'
import AppError from '@/models/error/AppError'
import ExceptionStatus from '@/utils/enum/ExceptionStatus'

describe('UserController', () => {
    const userServiceMock = {
        getUsers: jest.fn().mockResolvedValue(userList),
        getUserById: jest.fn().mockResolvedValue(user),
        addUser: jest.fn(),
        deleteUser: jest.fn(),
        getUserMissions: jest.fn().mockResolvedValue(userMissions),
        getUserRewards: jest.fn().mockResolvedValue(userRewards)
    }

    beforeEach(() => {
        const containerMock = {
            get: jest.fn().mockReturnValue(userServiceMock),
        }
        Container.get = containerMock.get
    })

    afterEach(() =>
        jest.clearAllMocks()
    )

    describe('getUsers', () => {
        it('should return a list of users', async () => {
            // Arrange

            // Act
            const { status, body } = await request(app)
                .get('/api/user')

            // Assert
            const expectedUsers = userList.map((user) => ({
                ...user,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
            }))

            expect(userServiceMock.getUsers).toHaveBeenCalled()
            expect(status).toBe(200)
            expect(body).toEqual({ users: expectedUsers })
        })
    })

    describe('getUserById', () => {
        it('should return the corresponding user', async () => {
            // Arrange
            const id = 'f94fbe96-373e-49b1-81c0-0df716e9b2ee'

            // Act
            const { status, body } = await request(app)
                .get(`/api/user/${id}`)

            // Assert
            const expectedUser = {
                ...user,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
            }
            expect(status).toBe(200)
            expect(body).toEqual(expectedUser)
            expect(userServiceMock.getUserById).toHaveBeenCalledWith(id)
        })

        it('should return 404 if no user was found', async () => {
            // Arrange
            const id = 'f94fbe96-373e-49b1-81c0-0df716e9b2ee'
            userServiceMock.getUserById.mockRejectedValueOnce(new AppError(ExceptionStatus.notFound, 404))

            // Act
            const { status } = await request(app)
                .get(`/api/user/${id}`)

            // Assert
            expect(status).toBe(404)
            expect(userServiceMock.getUserById).toHaveBeenCalledWith(id)
        })
    })

    describe('getUserMissions', () => {
        it('should return the active and completed missions', async () => {
            // Arrange
            const id = 'f94fbe96-373e-49b1-81c0-0df716e9b2ee'

            // Act
            const { status, body } = await request(app)
                .get(`/api/user/${id}/mission`)

            // Assert
            const expectedActive = userMissions.active.map((mission) => ({
                ...mission,
                expirationDate: mission.expirationDate.toISOString(),
                createdAt: mission.createdAt.toISOString(),
                updatedAt: mission.updatedAt.toISOString(),
            }))
            const expectedParticipating = userMissions.completed.map((mission) => ({
                ...mission,
                expirationDate: mission.expirationDate.toISOString(),
                createdAt: mission.createdAt.toISOString(),
                updatedAt: mission.updatedAt.toISOString(),
            }))
            const expectedCompleted = userMissions.completed.map((mission) => ({
                ...mission,
                expirationDate: mission.expirationDate.toISOString(),
                createdAt: mission.createdAt.toISOString(),
                updatedAt: mission.updatedAt.toISOString(),
            }))

            expect(userServiceMock.getUserMissions).toHaveBeenCalled()
            expect(status).toBe(200)
            expect(body).toEqual({ active: expectedActive, participating: expectedParticipating, completed: expectedCompleted })
        })
    })

    describe('getUserRewards', () => {
        it('should return the user available, claimed and received rewards', async () => {
            // Arrange
            const id = 'f94fbe96-373e-49b1-81c0-0df716e9b2ee'

            // Act
            const { status, body } = await request(app)
                .get(`/api/user/${id}/reward`)

            // Assert
            const expectedAvailable = userRewards.available.map((reward) => ({
                ...reward,
                createdAt: reward.createdAt.toISOString(),
                updatedAt: reward.updatedAt.toISOString(),
            }))
            const expectedClaimed = userRewards.claimed.map((reward) => ({
                ...reward,
                createdAt: reward.createdAt.toISOString(),
                updatedAt: reward.updatedAt.toISOString(),
            }))
            const expectedReceived = userRewards.claimed.map((reward) => ({
                ...reward,
                createdAt: reward.createdAt.toISOString(),
                updatedAt: reward.updatedAt.toISOString(),
            }))

            expect(userServiceMock.getUserRewards).toHaveBeenCalled()
            expect(status).toBe(200)
            expect(body).toEqual({ available: expectedAvailable, claimed: expectedClaimed, received: expectedReceived })
        })
    })

    describe('addUser', () => {
        it('should return a response with status code 201', async () => {
            // Arrange
            const newUser = { name: 'John Doe', email: 'johndoe@example.com' }

            // Act
            const { status } = await request(app)
                .post('/api/user').send(newUser)

            // Assert
            expect(userServiceMock.addUser).toHaveBeenCalledWith(newUser)
            expect(status).toBe(201)
        })
    })

    describe('deleteUser', () => {
        it('should return a response with status code 204', async () => {
            // Arrange
            const id = 'f94fbe96-373e-49b1-81c0-0df716e9b2ee'

            // Act
            const { status } = await request(app)
                .delete(`/api/user/${id}`)

            // Assert
            expect(userServiceMock.deleteUser).toHaveBeenCalledWith(id)
            expect(status).toBe(204)
        })
    })
})
