import app from '@/app'
import request from 'supertest'
import { rewardList } from '../mocks/Reward'
import { Container } from 'typedi'
import AppError from '@/models/error/AppError'
import ExceptionStatus from '@/utils/enum/ExceptionStatus'
import { adminHeaders, userHeaders, userId as authorizedUser, unauthorizedUserId} from '../mocks/DefaultHeaders'

describe('RewardController', () => {
    const rewardServiceMock = {
        getRewards: jest.fn().mockResolvedValue(rewardList),
        addReward: jest.fn(),
        deleteReward: jest.fn(),
        claimReward: jest.fn(),
        handReward: jest.fn(),
        cancelClaim: jest.fn()
    }

    beforeEach(() => {
        const containerMock = {
            get: jest.fn().mockReturnValue(rewardServiceMock),
        }
        Container.get = containerMock.get
    })

    afterEach(() =>
        jest.clearAllMocks()
    )

    const id = '99cc0b92-354a-4264-b841-d88bd1f5dc20'

    describe('getRewards', () => {
        it('should return a list of rewards', async () => {
            // Arrange

            // Act
            const { status, body } = await request(app)
                .get('/api/reward')
                .set(adminHeaders)

            // Assert
            const expectedRewards = rewardList.map((reward) => ({
                ...reward,
                createdAt: reward.createdAt.toISOString(),
                updatedAt: reward.updatedAt.toISOString(),
            }))

            expect(status).toBe(200)
            expect(rewardServiceMock.getRewards).toHaveBeenCalled()
            expect(body).toEqual({ rewards: expectedRewards })
        })

        it('should return 403 if user is forbidden', async () => {
            // Arrange

            // Act
            const { status } = await request(app)
                .get('/api/reward')
                .set(userHeaders)

            // Assert
            expect(status).toBe(403)
            expect(rewardServiceMock.getRewards).not.toBeCalled()
        })
    })

    describe('addReward', () => {
        it('should return a response with status code 201', async () => {
            // Arrange
            const newReward = {
                name: 'Reward 2',
                description: 'this is a description',
                price: 150,
                availability: 10
            }

            // Act
            const { status } = await request(app)
                .post('/api/reward').send(newReward)
                .set(adminHeaders)

            // Assert
            expect(status).toBe(201)
            expect(rewardServiceMock.addReward).toHaveBeenCalledWith(newReward)
        })

        it('should return 403 if user is forbidden', async () => {
            // Arrange
            const newReward = {
                name: 'Reward 2',
                description: 'this is a description',
                price: 150,
                availability: 10
            }

            // Act
            const { status } = await request(app)
                .post('/api/reward').send(newReward)
                .set(userHeaders)

            // Assert
            expect(status).toBe(403)
            expect(rewardServiceMock.addReward).not.toBeCalled()
        })
    })

    describe('deleteReward', () => {
        it('should return a response with status code 204', async () => {
            // Arrange

            // Act
            const { status } = await request(app)
                .delete(`/api/reward/${id}`)
                .set(adminHeaders)

            // Assert
            expect(status).toBe(204)
            expect(rewardServiceMock.deleteReward).toHaveBeenCalledWith(id)
        })

        it('should return 404 if no reward was found', async () => {
            // Arrange
            rewardServiceMock.deleteReward.mockRejectedValueOnce(new AppError(ExceptionStatus.notFound, 404))

            // Act
            const { status } = await request(app)
                .delete(`/api/reward/${id}`)
                .set(adminHeaders)

            // Assert
            expect(status).toBe(404)
            expect(rewardServiceMock.deleteReward).toHaveBeenCalledWith(id)
        })

        it('should return 400 if reward was handed', async () => {
            // Arrange
            rewardServiceMock.deleteReward.mockRejectedValueOnce(new AppError(ExceptionStatus.invalidRequest, 400))

            // Act
            const { status } = await request(app)
                .delete(`/api/reward/${id}`)
                .set(adminHeaders)

            // Assert
            expect(status).toBe(400)
            expect(rewardServiceMock.deleteReward).toHaveBeenCalledWith(id)
        })

        it('should return 403 if user is forbidden', async () => {
            // Arrange

            // Act
            const { status } = await request(app)
                .delete(`/api/reward/${id}`)
                .set(userHeaders)

            // Assert
            expect(status).toBe(403)
            expect(rewardServiceMock.deleteReward).not.toBeCalled()
        })
    })

    describe('claimReward', () => {
        it('should return a response with status code 204', async () => {
            // Arrange
            const userId = authorizedUser

            // Act
            const { status } = await request(app)
                .put(`/api/reward/${id}/${userId}`)
                .set(userHeaders)

            // Assert
            expect(status).toBe(204)
            expect(rewardServiceMock.claimReward).toHaveBeenCalledWith(id, userId)
        })

        it('should return 404 if no reward or user was found', async () => {
            // Arrange
            const userId = authorizedUser

            rewardServiceMock.claimReward.mockRejectedValueOnce(new AppError(ExceptionStatus.notFound, 404))

            // Act
            const { status } = await request(app)
                .put(`/api/reward/${id}/${userId}`)
                .set(userHeaders)

            // Assert
            expect(status).toBe(404)
            expect(rewardServiceMock.claimReward).toHaveBeenCalledWith(id, userId)
        })

        it('should return 400 if user does not have sufficient balance', async () => {
            // Arrange
            const userId = authorizedUser
            rewardServiceMock.claimReward.mockRejectedValueOnce(new AppError(ExceptionStatus.invalidRequest, 400))

            // Act
            const { status } = await request(app)
                .put(`/api/reward/${id}/${userId}`)
                .set(userHeaders)

            // Assert
            expect(status).toBe(400)
            expect(rewardServiceMock.claimReward).toHaveBeenCalledWith(id, userId)
        })

        it('should return 403 if user is forbidden', async () => {
            // Arrange
            const userId = unauthorizedUserId

            // Act
            const { status } = await request(app)
                .put(`/api/reward/${id}/${userId}`)
                .set(userHeaders)

            // Assert
            expect(status).toBe(403)
            expect(rewardServiceMock.claimReward).not.toBeCalled()
        })
    })

    describe('handReward', () => {
        it('should return a response with status code 204', async () => {
            // Arrange
            const userId = authorizedUser

            // Act
            const { status } = await request(app)
                .patch(`/api/reward/${id}/${userId}`)
                .set(adminHeaders)

            // Assert
            expect(status).toBe(204)
            expect(rewardServiceMock.handReward).toHaveBeenCalledWith(id, userId)
        })

        it('should return 404 if no reward or user was found', async () => {
            // Arrange
            const userId = authorizedUser

            rewardServiceMock.handReward.mockRejectedValueOnce(new AppError(ExceptionStatus.notFound, 404))

            // Act
            const { status } = await request(app)
                .patch(`/api/reward/${id}/${userId}`)
                .set(adminHeaders)

            // Assert
            expect(status).toBe(404)
            expect(rewardServiceMock.handReward).toHaveBeenCalledWith(id, userId)
        })

        it('should return 400 if user did not claim the reward', async () => {
            // Arrange
            const userId = authorizedUser
            rewardServiceMock.handReward.mockRejectedValueOnce(new AppError(ExceptionStatus.invalidRequest, 400))

            // Act
            const { status } = await request(app)
                .patch(`/api/reward/${id}/${userId}`)
                .set(adminHeaders)

            // Assert
            expect(status).toBe(400)
            expect(rewardServiceMock.handReward).toHaveBeenCalledWith(id, userId)
        })

        it('should return 403 if user is forbidden', async () => {
            // Arrange
            const userId = authorizedUser

            // Act
            const { status } = await request(app)
                .patch(`/api/reward/${id}/${userId}`)
                .set(userHeaders)

            // Assert
            expect(status).toBe(403)
            expect(rewardServiceMock.handReward).not.toBeCalled()
        })
    })

    describe('cancelClaim', () => {
        it('should return a response with status code 204', async () => {
            // Arrange
            const userId = authorizedUser

            // Act
            const { status } = await request(app)
                .delete(`/api/reward/${id}/${userId}`)
                .set(userHeaders)

            // Assert
            expect(status).toBe(204)
            expect(rewardServiceMock.cancelClaim).toHaveBeenCalledWith(id, userId)
        })

        it('should return 404 if no reward or user was found', async () => {
            // Arrange
            const userId = authorizedUser

            rewardServiceMock.cancelClaim.mockRejectedValueOnce(new AppError(ExceptionStatus.notFound, 404))

            // Act
            const { status } = await request(app)
                .delete(`/api/reward/${id}/${userId}`)
                .set(userHeaders)

            // Assert
            expect(status).toBe(404)
            expect(rewardServiceMock.cancelClaim).toHaveBeenCalledWith(id, userId)
        })

        it('should return 400 if user did not claim the reward', async () => {
            // Arrange
            const userId = authorizedUser
            rewardServiceMock.cancelClaim.mockRejectedValueOnce(new AppError(ExceptionStatus.invalidRequest, 400))

            // Act
            const { status } = await request(app)
                .delete(`/api/reward/${id}/${userId}`)
                .set(userHeaders)

            // Assert
            expect(status).toBe(400)
            expect(rewardServiceMock.cancelClaim).toHaveBeenCalledWith(id, userId)
        })

        it('should return 403 if user is forbidden', async () => {
            // Arrange
            const userId = unauthorizedUserId

            // Act
            const { status } = await request(app)
                .delete(`/api/reward/${id}/${userId}`)
                .set(userHeaders)

            // Assert
            expect(status).toBe(403)
            expect(rewardServiceMock.cancelClaim).not.toBeCalled()
        })
    })
})
