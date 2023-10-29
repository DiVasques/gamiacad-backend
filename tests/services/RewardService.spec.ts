import { RewardService } from '@/services/RewardService'
import { Reward } from '@/models/Reward'
import { editReward, reward, rewardList } from '../mocks/Reward'
import { user } from '../mocks/User'
import AppError from '@/models/error/AppError'

describe('RewardService', () => {
    let rewardService: RewardService
    let rewardRepositoryMock: any
    let userRepositoryMock: any

    beforeEach(() => {
        rewardRepositoryMock = {
            find: jest.fn().mockResolvedValue(rewardList),
            create: jest.fn(),
            update: jest.fn(),
            findById: jest.fn().mockResolvedValue(reward),
            deactivateReward: jest.fn().mockResolvedValue(1),
            claimReward: jest.fn().mockResolvedValue(1),
            handReward: jest.fn().mockResolvedValue(1),
            rollbackClaim: jest.fn()
        }
        userRepositoryMock = {
            findById: jest.fn().mockResolvedValue(user),
            withdrawPoints: jest.fn().mockResolvedValue(1),
            givePoints: jest.fn()
        }
        rewardService = new RewardService()
        rewardService['rewardRepository'] = rewardRepositoryMock
        rewardService['userRepository'] = userRepositoryMock
    })

    afterEach(() =>
        jest.clearAllMocks()
    )

    describe('getRewards', () => {
        it('should return rewards from the repository', async () => {
            // Arrange
            const filter = { name: 'name' }

            // Act
            const result = await rewardService.getRewards(filter)

            // Assert
            expect(rewardRepositoryMock.find).toHaveBeenCalledWith(filter)
            expect(result).toEqual(rewardList)
        })
    })

    describe('addReward', () => {
        it('should add the reward', async () => {
            // Arrange
            const reward: Partial<Reward> = {
                name: 'Reward 1',
                description: 'this is a description',
                price: 150,
                availability: 10
            }

            // Act
            await rewardService.addReward(reward)

            // Assert
            expect(rewardRepositoryMock.create).toHaveBeenCalledWith(reward)
        })
    })

    describe('editReward', () => {
        it('should throw an error if the reward is not found', async () => {
            // Arrange
            const id = '123'
            rewardRepositoryMock.findById.mockResolvedValue(null)
            let error

            // Act
            try {
                await rewardService.editReward(id, editReward)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).status).toBe(404)
            expect(rewardRepositoryMock.findById).toHaveBeenCalledWith(id)
        })

        it('should edit the reward if it exists', async () => {
            // Arrange
            const id = '123'

            // Act
            await rewardService.editReward(id, editReward)

            // Assert
            expect(rewardRepositoryMock.findById).toHaveBeenCalledWith(id)
            expect(rewardRepositoryMock.update).toHaveBeenCalledWith(id, editReward)
        })
    })

    describe('deactivateReward', () => {
        it('should throw an error if the reward is not found', async () => {
            // Arrange
            const id = '123'
            rewardRepositoryMock.findById.mockResolvedValue(null)
            let error

            // Act
            try {
                await rewardService.deactivateReward(id)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).status).toBe(404)
            expect(rewardRepositoryMock.findById).toHaveBeenCalledWith(id)
        })

        it('should throw an error if the reward was already deactivated', async () => {
            // Arrange
            const id = '123'
            rewardRepositoryMock.deactivateReward.mockResolvedValue(0)
            let error

            // Act
            try {
                await rewardService.deactivateReward(id)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).status).toBe(400)
            expect(rewardRepositoryMock.findById).toHaveBeenCalledWith(id)
            expect(rewardRepositoryMock.deactivateReward).toHaveBeenCalledWith(id)
        })

        it('should deactivate the reward if it exists and was not deactivated', async () => {
            // Arrange
            const id = '123'

            // Act
            await rewardService.deactivateReward(id)

            // Assert
            expect(rewardRepositoryMock.findById).toHaveBeenCalledWith(id)
            expect(rewardRepositoryMock.deactivateReward).toHaveBeenCalledWith(id)
            expect(rewardRepositoryMock.rollbackClaim).toHaveBeenCalledWith(id, reward.claimers.at(0))
            expect(userRepositoryMock.givePoints).toHaveBeenCalledWith(reward.claimers.at(0), reward.price, true)
        })
    })

    describe('claimReward', () => {
        it('should throw an error if the reward was not found', async () => {
            // Arrange
            const id = '123'
            const userId = '456'
            rewardRepositoryMock.findById.mockResolvedValue(null)
            let error

            // Act
            try {
                await rewardService.claimReward(id, userId)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).status).toBe(404)
            expect(rewardRepositoryMock.findById).toHaveBeenCalledWith(id)
            expect(rewardRepositoryMock.claimReward).not.toHaveBeenCalled()
            expect(userRepositoryMock.withdrawPoints).not.toHaveBeenCalled()
            expect(rewardRepositoryMock.rollbackClaim).not.toHaveBeenCalled()
        })
        it('should throw an error if the user was not found', async () => {
            // Arrange
            const id = '123'
            const userId = '456'
            userRepositoryMock.findById.mockResolvedValue(null)
            let error

            // Act
            try {
                await rewardService.claimReward(id, userId)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).status).toBe(404)
            expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId)
            expect(rewardRepositoryMock.claimReward).not.toHaveBeenCalled()
            expect(userRepositoryMock.withdrawPoints).not.toHaveBeenCalled()
            expect(rewardRepositoryMock.rollbackClaim).not.toHaveBeenCalled()
        })

        it('should throw an error if the user does not have sufficient balance', async () => {
            // Arrange
            const id = '123'
            const userId = '456'
            userRepositoryMock.findById.mockResolvedValue({ ...user, balance: 0 })
            let error

            // Act
            try {
                await rewardService.claimReward(id, userId)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).status).toBe(400)
            expect(rewardRepositoryMock.findById).toHaveBeenCalledWith(id)
            expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId)
            expect(rewardRepositoryMock.claimReward).not.toHaveBeenCalled()
            expect(userRepositoryMock.withdrawPoints).not.toHaveBeenCalled()
            expect(rewardRepositoryMock.rollbackClaim).not.toHaveBeenCalled()
        })

        it('should throw an error if the reward is not available anymore', async () => {
            // Arrange
            const id = '123'
            const userId = '456'
            rewardRepositoryMock.claimReward.mockResolvedValue(0)
            let error

            // Act
            try {
                await rewardService.claimReward(id, userId)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).status).toBe(400)
            expect(rewardRepositoryMock.findById).toHaveBeenCalledWith(id)
            expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId)
            expect(rewardRepositoryMock.claimReward).toHaveBeenCalledWith(id, userId)
            expect(userRepositoryMock.withdrawPoints).not.toHaveBeenCalled()
            expect(rewardRepositoryMock.rollbackClaim).not.toHaveBeenCalled()
        })

        it('should throw an error and rollback claim if could not withdraw points', async () => {
            // Arrange
            const id = '123'
            const userId = '456'
            userRepositoryMock.withdrawPoints.mockResolvedValue(0)
            let error

            // Act
            try {
                await rewardService.claimReward(id, userId)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).status).toBe(400)
            expect(rewardRepositoryMock.findById).toHaveBeenCalledWith(id)
            expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId)
            expect(rewardRepositoryMock.claimReward).toHaveBeenCalledWith(id, userId)
            expect(userRepositoryMock.withdrawPoints).toHaveBeenCalledWith(userId, reward.price)
            expect(rewardRepositoryMock.rollbackClaim).toHaveBeenCalledWith(id, userId)
        })

        it('should claim the reward', async () => {
            // Arrange
            const id = '123'
            const userId = '456'

            // Act
            await rewardService.claimReward(id, userId)

            // Assert
            expect(rewardRepositoryMock.findById).toHaveBeenCalledWith(id)
            expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId)
            expect(rewardRepositoryMock.claimReward).toHaveBeenCalledWith(id, userId)
            expect(userRepositoryMock.withdrawPoints).toHaveBeenCalledWith(userId, reward.price)
            expect(rewardRepositoryMock.rollbackClaim).not.toHaveBeenCalled()
        })
    })

    describe('handReward', () => {
        it('should throw an error if the reward was not found', async () => {
            // Arrange
            const id = '123'
            const userId = '456'
            rewardRepositoryMock.findById.mockResolvedValue(null)
            let error

            // Act
            try {
                await rewardService.handReward(id, userId)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).status).toBe(404)
            expect(rewardRepositoryMock.findById).toHaveBeenCalledWith(id)
            expect(rewardRepositoryMock.handReward).not.toHaveBeenCalled()
        })
        it('should throw an error if the user was not found', async () => {
            // Arrange
            const id = '123'
            const userId = '456'
            userRepositoryMock.findById.mockResolvedValue(null)
            let error

            // Act
            try {
                await rewardService.handReward(id, userId)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).status).toBe(404)
            expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId)
            expect(rewardRepositoryMock.handReward).not.toHaveBeenCalled()
        })

        it('should throw an error if the user did not claim the reward', async () => {
            // Arrange
            const id = '123'
            const userId = '456'
            rewardRepositoryMock.handReward.mockResolvedValue(0)
            let error

            // Act
            try {
                await rewardService.handReward(id, userId)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).status).toBe(400)
            expect(rewardRepositoryMock.findById).toHaveBeenCalledWith(id)
            expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId)
            expect(rewardRepositoryMock.handReward).toHaveBeenCalledWith(id, userId)
        })

        it('should hand the reward', async () => {
            // Arrange
            const id = '123'
            const userId = '456'

            // Act
            await rewardService.handReward(id, userId)

            // Assert
            expect(rewardRepositoryMock.findById).toHaveBeenCalledWith(id)
            expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId)
            expect(rewardRepositoryMock.handReward).toHaveBeenCalledWith(id, userId)
        })
    })

    describe('cancelClaim', () => {
        it('should throw an error if the reward was not found', async () => {
            // Arrange
            const id = '123'
            const userId = '456'
            rewardRepositoryMock.findById.mockResolvedValue(null)
            let error

            // Act
            try {
                await rewardService.cancelClaim(id, userId)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).status).toBe(404)
            expect(rewardRepositoryMock.findById).toHaveBeenCalledWith(id)
            expect(rewardRepositoryMock.rollbackClaim).not.toHaveBeenCalled()
            expect(userRepositoryMock.givePoints).not.toHaveBeenCalled()
        })
        it('should throw an error if the user was not found', async () => {
            // Arrange
            const id = '123'
            const userId = '456'
            userRepositoryMock.findById.mockResolvedValue(null)
            let error

            // Act
            try {
                await rewardService.cancelClaim(id, userId)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).status).toBe(404)
            expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId)
            expect(rewardRepositoryMock.rollbackClaim).not.toHaveBeenCalled()
            expect(userRepositoryMock.givePoints).not.toHaveBeenCalled()
        })

        it('should throw an error if the user did not claim the reward', async () => {
            // Arrange
            const id = '123'
            const userId = '456'
            rewardRepositoryMock.rollbackClaim.mockResolvedValue(0)
            let error

            // Act
            try {
                await rewardService.cancelClaim(id, userId)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).status).toBe(400)
            expect(rewardRepositoryMock.findById).toHaveBeenCalledWith(id)
            expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId)
            expect(rewardRepositoryMock.rollbackClaim).toHaveBeenCalledWith(id, userId)
            expect(userRepositoryMock.givePoints).not.toHaveBeenCalled()
        })

        it('should hand the reward', async () => {
            // Arrange
            const id = '123'
            const userId = '456'

            // Act
            await rewardService.cancelClaim(id, userId)

            // Assert
            expect(rewardRepositoryMock.findById).toHaveBeenCalledWith(id)
            expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId)
            expect(rewardRepositoryMock.rollbackClaim).toHaveBeenCalledWith(id, userId)
            expect(userRepositoryMock.givePoints).toHaveBeenCalledWith(userId, reward.price, true)
        })
    })
})