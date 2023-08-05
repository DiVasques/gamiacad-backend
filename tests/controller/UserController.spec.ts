import app from '@/app'
import request from 'supertest'
import { user, userList } from '../mocks/User'
import { userMissions } from '../mocks/Mission'
import { userRewards } from '../mocks/Reward'
import { Container } from 'typedi'
import AppError from '@/models/error/AppError'
import ExceptionStatus from '@/utils/enum/ExceptionStatus'
import { userHeaders, adminHeaders, unauthorizedUserId, userId } from '../mocks/DefaultHeaders'

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
                .set(adminHeaders)

            // Assert
            const expectedUsers = userList.map((user) => ({
                ...user,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
            }))

            expect(status).toBe(200)
            expect(userServiceMock.getUsers).toHaveBeenCalled()
            expect(body).toEqual({ users: expectedUsers })
        })

        it('should return 403 if user is forbidden', async () => {
            // Arrange

            // Act
            const { status } = await request(app)
                .get('/api/user')
                .set(userHeaders)

            // Assert
            expect(status).toBe(403)
            expect(userServiceMock.getUsers).not.toBeCalled()
        })
    })

    describe('getUserById', () => {
        it('should return the corresponding user', async () => {
            // Arrange
            const id = userId

            // Act
            const { status, body } = await request(app)
                .get(`/api/user/${id}`)
                .set(userHeaders)

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
            const id = userId
            userServiceMock.getUserById.mockRejectedValueOnce(new AppError(ExceptionStatus.notFound, 404))

            // Act
            const { status } = await request(app)
                .get(`/api/user/${id}`)
                .set(userHeaders)

            // Assert
            expect(status).toBe(404)
            expect(userServiceMock.getUserById).toHaveBeenCalledWith(id)
        })

        it('should return 403 if user is forbidden', async () => {
            // Arrange
            const id = unauthorizedUserId

            // Act
            const { status } = await request(app)
                .get(`/api/user/${id}`)
                .set(userHeaders)

            // Assert
            expect(status).toBe(403)
            expect(userServiceMock.getUserById).not.toBeCalled()
        })
    })

    describe('getUserMissions', () => {
        it('should return the active and completed missions', async () => {
            // Arrange
            const id = userId

            // Act
            const { status, body } = await request(app)
                .get(`/api/user/${id}/mission`)
                .set(userHeaders)

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

            expect(status).toBe(200)
            expect(userServiceMock.getUserMissions).toHaveBeenCalled()
            expect(body).toEqual({ active: expectedActive, participating: expectedParticipating, completed: expectedCompleted })
        })

        it('should return 403 if user is forbidden', async () => {
            // Arrange
            const id = unauthorizedUserId

            // Act
            const { status } = await request(app)
                .get(`/api/user/${id}/mission`)
                .set(userHeaders)

            // Assert
            expect(status).toBe(403)
            expect(userServiceMock.getUserMissions).not.toBeCalled()
        })
    })

    describe('getUserRewards', () => {
        it('should return the user available, claimed and received rewards', async () => {
            // Arrange
            const id = userId

            // Act
            const { status, body } = await request(app)
                .get(`/api/user/${id}/reward`)
                .set(userHeaders)

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

            expect(status).toBe(200)
            expect(userServiceMock.getUserRewards).toHaveBeenCalled()
            expect(body).toEqual({ available: expectedAvailable, claimed: expectedClaimed, received: expectedReceived })
        })

        it('should return 403 if user is forbidden', async () => {
            // Arrange
            const id = unauthorizedUserId

            // Act
            const { status } = await request(app)
                .get(`/api/user/${id}/reward`)
                .set(userHeaders)

            // Assert
            expect(status).toBe(403)
            expect(userServiceMock.getUserRewards).not.toBeCalled()
        })
    })

    describe('addUser', () => {
        it('should return a response with status code 201', async () => {
            // Arrange
            const newUser = { name: 'John Doe', email: 'johndoe@example.com' }
            const id = userId

            // Act
            const { status } = await request(app)
                .post(`/api/user/${id}`).send(newUser)
                .set(userHeaders)

            // Assert
            expect(status).toBe(201)
            expect(userServiceMock.addUser).toHaveBeenCalledWith(newUser)
        })

        it('should return 403 if user is forbidden', async () => {
            // Arrange
            const newUser = { name: 'John Doe', email: 'johndoe@example.com' }
            const id = unauthorizedUserId

            // Act
            const { status } = await request(app)
                .post(`/api/user/${id}`).send(newUser)
                .set(userHeaders)

            // Assert
            expect(status).toBe(403)
            expect(userServiceMock.addUser).not.toBeCalled()
        })
    })

    describe('deleteUser', () => {
        it('should return a response with status code 204', async () => {
            // Arrange
            const id = userId

            // Act
            const { status } = await request(app)
                .delete(`/api/user/${id}`)
                .set(userHeaders)

            // Assert
            expect(status).toBe(204)
            expect(userServiceMock.deleteUser).toHaveBeenCalledWith(id)
        })

        it('should return 403 if user is forbidden', async () => {
            // Arrange
            const id = unauthorizedUserId

            // Act
            const { status } = await request(app)
                .delete(`/api/user/${id}`)
                .set(userHeaders)

            // Assert
            expect(status).toBe(403)
            expect(userServiceMock.deleteUser).not.toBeCalled()
        })
    })
})
