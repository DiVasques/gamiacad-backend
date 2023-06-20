import { RewardService } from '@/services/RewardService'
import { Reward } from '@/models/Reward'
import { reward, rewardList } from '../mocks/Reward'
import AppError from '@/models/error/AppError'

describe('RewardService', () => {
    let rewardService: RewardService
    let rewardRepositoryMock: any

    beforeEach(() => {
        rewardRepositoryMock = {
            find: jest.fn().mockResolvedValue(rewardList),
            create: jest.fn(),
            findById: jest.fn().mockResolvedValue(reward),
            delete: jest.fn()
        }
        rewardService = new RewardService()
        rewardService['rewardRepository'] = rewardRepositoryMock
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

    describe('deleteReward', () => {
        it('should throw an error if the reward is not found', async () => {
            // Arrange
            const id = '123'
            rewardRepositoryMock.findById.mockResolvedValue(null)
            let error

            // Act
            try {
                await rewardService.deleteReward(id)
            } catch (e) {
                error = e
            }
            
            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).status).toBe(404)
            expect(rewardRepositoryMock.findById).toHaveBeenCalledWith(id)
        })

        it('should throw an error if the reward was already handed', async () => {
            // Arrange
            const id = '123'
            const rewardWithCompleters = {
                id: '123',
                handed: ['user1', 'user2']
            }
            rewardRepositoryMock.findById.mockResolvedValue(rewardWithCompleters)
            let error

            // Act
            try {
                await rewardService.deleteReward(id)
            } catch (e) {
                error = e
            }
            
            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).status).toBe(400)
            expect(rewardRepositoryMock.findById).toHaveBeenCalledWith(id)
        })

        it('should delete the reward if it exists and wasnt handed', async () => {
            // Arrange
            const id = '123'

            // Act
            await rewardService.deleteReward(id)

            // Assert
            expect(rewardRepositoryMock.findById).toHaveBeenCalledWith(id)
            expect(rewardRepositoryMock.delete).toHaveBeenCalledWith(id)
        })
    })
})