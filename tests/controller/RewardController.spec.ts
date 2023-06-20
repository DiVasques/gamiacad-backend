import app from '@/app'
import request from 'supertest'
import { rewardList } from '../mocks/Reward'
import { Container } from 'typedi'
import AppError from '@/models/error/AppError'
import ExceptionStatus from '@/utils/enum/ExceptionStatus'

describe('RewardController', () => {
    const rewardServiceMock = {
        getRewards: jest.fn().mockResolvedValue(rewardList),
        addReward: jest.fn(),
        deleteReward: jest.fn()
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

    describe('getRewards', () => {
        it('should return a list of rewards', async () => {
            // Arrange

            // Act
            const { status, body } = await request(app)
                .get(`/api/reward`)

            // Assert
            const expectedRewards = rewardList.map((reward) => ({
                ...reward,
                createdAt: reward.createdAt.toISOString(),
                updatedAt: reward.updatedAt.toISOString(),
            }))

            expect(rewardServiceMock.getRewards).toHaveBeenCalled()
            expect(status).toBe(200)
            expect(body).toEqual({ rewards: expectedRewards })
        })
    })

    describe('addReward', () => {
        it('should return a response with status code 201', async () => {
            // Arrange
            const newReward = {
                name: 'Reward 1',
                description: 'this is a description',
                points: 150,
                expirationDate: new Date(9999999999999),
                createdBy: '1b6ec50e-9be1-459f-bd69-11bfa325d03b'
            }

            // Act
            const { status } = await request(app)
                .post(`/api/reward`).send(newReward)

            // Assert
            expect(rewardServiceMock.addReward).toHaveBeenCalledWith(newReward)
            expect(status).toBe(201)
        })
    })

    describe('deleteReward', () => {
        it('should return a response with status code 202', async () => {
            // Arrange
            const id = 'f94fbe96-373e-49b1-81c0-0df716e9b2ee'

            // Act
            const { status } = await request(app)
                .delete(`/api/reward/${id}`)

            // Assert
            expect(status).toBe(202)
            expect(rewardServiceMock.deleteReward).toHaveBeenCalledWith(id)
        })
        
        it('should return 404 if no reward was found', async () => {
            // Arrange
            const id = 'f94fbe96-373e-49b1-81c0-0df716e9b2ee'
            rewardServiceMock.deleteReward.mockRejectedValueOnce(new AppError(ExceptionStatus.notFound, 404))

            // Act
            const { status } = await request(app)
                .delete(`/api/reward/${id}`)

            // Assert
            expect(status).toBe(404)
            expect(rewardServiceMock.deleteReward).toHaveBeenCalledWith(id)
        })
        
        it('should return 400 if reward was handed', async () => {
            // Arrange
            const id = 'f94fbe96-373e-49b1-81c0-0df716e9b2ee'
            rewardServiceMock.deleteReward.mockRejectedValueOnce(new AppError(ExceptionStatus.invalidRequest, 400))

            // Act
            const { status } = await request(app)
                .delete(`/api/reward/${id}`)

            // Assert
            expect(status).toBe(400)
            expect(rewardServiceMock.deleteReward).toHaveBeenCalledWith(id)
        })
    })
})
