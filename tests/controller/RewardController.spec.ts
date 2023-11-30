import app from '@/app'
import request from 'supertest'
import { claimedRewardList, reward, rewardList } from '../mocks/Reward'
import { Container } from 'typedi'
import AppError from '@/models/error/AppError'
import ExceptionStatus from '@/utils/enum/ExceptionStatus'
import { adminHeaders, userHeaders, userId as authorizedUser, unauthorizedUserId, adminUserId } from '../mocks/DefaultHeaders'

describe('RewardController', () => {
    const rewardServiceMock = {
        getRewards: jest.fn().mockResolvedValue(rewardList),
        getReward: jest.fn().mockResolvedValue(reward),
        getClaimedRewards: jest.fn().mockResolvedValue(claimedRewardList),
        addReward: jest.fn(),
        editReward: jest.fn(),
        deactivateReward: jest.fn(),
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
                claimers: [{...reward.claimers.at(0), date: reward.claimers.at(0)?.date.toISOString()}],
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

    describe('getReward', () => {
        it('should return the reward', async () => {
            // Arrange

            // Act
            const { status } = await request(app)
                .get(`/api/reward/${id}`)
                .set(adminHeaders)

            // Assert
            expect(status).toBe(200)
            expect(rewardServiceMock.getReward).toHaveBeenCalledWith(id)
        })

        it('should return 404 if no reward was found', async () => {
            // Arrange
            rewardServiceMock.getReward.mockRejectedValueOnce(new AppError(ExceptionStatus.notFound, 404))

            // Act
            const { status } = await request(app)
                .get(`/api/reward/${id}`)
                .set(adminHeaders)

            // Assert
            expect(status).toBe(404)
            expect(rewardServiceMock.getReward).toHaveBeenCalledWith(id)
        })

        it('should return 403 if user is forbidden', async () => {
            // Arrange

            // Act
            const { status } = await request(app)
                .get(`/api/reward/${id}`)
                .set(userHeaders)

            // Assert
            expect(status).toBe(403)
            expect(rewardServiceMock.getReward).not.toBeCalled()
        })
    })

    describe('getClaimedRewards', () => {
        it('should return a list of rewards', async () => {
            // Act
            const { status, body } = await request(app)
                .get('/api/reward/claimed')
                .set(adminHeaders)

            // Assert
            const expectedRewards = claimedRewardList.map((reward) => ({
                ...reward,
                claimDate: reward.claimDate.toISOString(),
            }))

            expect(status).toBe(200)
            expect(rewardServiceMock.getClaimedRewards).toHaveBeenCalled()
            expect(body).toEqual({ rewards: expectedRewards })
        })

        it('should return 403 if user is forbidden', async () => {
            // Act
            const { status } = await request(app)
                .get('/api/reward/claimed')
                .set(userHeaders)

            // Assert
            expect(status).toBe(403)
            expect(rewardServiceMock.getClaimedRewards).not.toBeCalled()
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

    describe('editReward', () => {
        it('should return a response with status code 204', async () => {
            // Arrange
            const editReward = {
                name: 'Reward 2',
                description: 'this is a description'
            }

            // Act
            const { status } = await request(app)
                .patch(`/api/reward/${id}`).send(editReward)
                .set(adminHeaders)

            // Assert
            expect(status).toBe(204)
            expect(rewardServiceMock.editReward).toHaveBeenCalledWith(id, editReward)
        })

        it('should return 404 if reward was not found', async () => {
            // Arrange
            const editReward = {
                name: 'Reward 2',
                description: 'this is a description'
            }
            rewardServiceMock.editReward.mockRejectedValueOnce(new AppError(ExceptionStatus.notFound, 404))

            // Act
            const { status } = await request(app)
                .patch(`/api/reward/${id}`).send(editReward)
                .set(adminHeaders)

            // Assert
            expect(status).toBe(404)
            expect(rewardServiceMock.editReward).toHaveBeenCalledWith(id, editReward)
        })

        it('should return 403 if user is forbidden', async () => {
            // Arrange
            const editReward = {
                name: 'Reward 2',
                description: 'this is a description'
            }

            // Act
            const { status } = await request(app)
                .patch(`/api/reward/${id}`).send(editReward)
                .set(userHeaders)

            // Assert
            expect(status).toBe(403)
            expect(rewardServiceMock.editReward).not.toBeCalled()
        })
    })

    describe('deactivateReward', () => {
        it('should return a response with status code 204', async () => {
            // Arrange

            // Act
            const { status } = await request(app)
                .delete(`/api/reward/${id}`)
                .set(adminHeaders)

            // Assert
            expect(status).toBe(204)
            expect(rewardServiceMock.deactivateReward).toHaveBeenCalledWith(id)
        })

        it('should return 404 if no reward was found', async () => {
            // Arrange
            rewardServiceMock.deactivateReward.mockRejectedValueOnce(new AppError(ExceptionStatus.notFound, 404))

            // Act
            const { status } = await request(app)
                .delete(`/api/reward/${id}`)
                .set(adminHeaders)

            // Assert
            expect(status).toBe(404)
            expect(rewardServiceMock.deactivateReward).toHaveBeenCalledWith(id)
        })

        it('should return 400 if reward is inactive', async () => {
            // Arrange
            rewardServiceMock.deactivateReward.mockRejectedValueOnce(new AppError(ExceptionStatus.invalidRequest, 400))

            // Act
            const { status } = await request(app)
                .delete(`/api/reward/${id}`)
                .set(adminHeaders)

            // Assert
            expect(status).toBe(400)
            expect(rewardServiceMock.deactivateReward).toHaveBeenCalledWith(id)
        })

        it('should return 403 if user is forbidden', async () => {
            // Arrange

            // Act
            const { status } = await request(app)
                .delete(`/api/reward/${id}`)
                .set(userHeaders)

            // Assert
            expect(status).toBe(403)
            expect(rewardServiceMock.deactivateReward).not.toBeCalled()
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
            expect(rewardServiceMock.claimReward).toHaveBeenCalledWith(id, userId, userId)
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
            expect(rewardServiceMock.claimReward).toHaveBeenCalledWith(id, userId, userId)
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
            expect(rewardServiceMock.claimReward).toHaveBeenCalledWith(id, userId, userId)
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
            expect(rewardServiceMock.handReward).toHaveBeenCalledWith(id, userId, adminUserId)
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
            expect(rewardServiceMock.handReward).toHaveBeenCalledWith(id, userId, adminUserId)
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
            expect(rewardServiceMock.handReward).toHaveBeenCalledWith(id, userId, adminUserId)
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
