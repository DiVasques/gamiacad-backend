import { UserService } from '@/services/UserService'
import { mission, missionList, userMission } from '../mocks/Mission'
import { reward, rewardList, userReward } from '../mocks/Reward'
import { user, userList } from '../mocks/User'
import { User } from '@/models/User'
import AppError from '@/models/error/AppError'
import ExceptionStatus from '@/utils/enum/ExceptionStatus'

describe('UserService', () => {
    let userService: UserService
    let userRepositoryMock: any
    let missionRepositoryMock: any
    let rewardRepositoryMock: any

    beforeEach(() => {
        userRepositoryMock = {
            find: jest.fn().mockResolvedValue(userList),
            findById: jest.fn().mockResolvedValue(user),
            create: jest.fn(),
            delete: jest.fn()
        }
        missionRepositoryMock = {
            findActiveMissions: jest.fn().mockResolvedValue(missionList),
            findUserCompletedMissions: jest.fn().mockResolvedValue(missionList)
        }
        rewardRepositoryMock = {
            findAvailableRewards: jest.fn().mockResolvedValue(rewardList),
            findClaimedRewards: jest.fn().mockResolvedValue(rewardList),
            findHandedRewards: jest.fn().mockResolvedValue(rewardList)
        }
        userService = new UserService()
        userService['userRepository'] = userRepositoryMock
        userService['missionRepository'] = missionRepositoryMock
        userService['rewardRepository'] = rewardRepositoryMock
    })

    afterEach(() =>
        jest.clearAllMocks()
    )

    describe('getUsers', () => {
        it('should return users from the repository', async () => {
            // Arrange
            const filter = { name: 'name' }

            // Act
            const result = await userService.getUsers(filter)

            // Assert
            expect(userRepositoryMock.find).toHaveBeenCalledWith(filter)
            expect(result).toEqual(userList)
        })
    })

    describe('getUserById', () => {
        it('should return the corresponding user from the repository', async () => {
            // Arrange
            const id = 'f94fbe96-373e-49b1-81c0-0df716e9b2ee'

            // Act
            const result = await userService.getUserById(id)

            // Assert
            expect(userRepositoryMock.findById).toHaveBeenCalledWith(id)
            expect(result).toEqual(user)
        })

        it('should throw 404 when user is not found', async () => {
            // Arrange
            const id = '412312312'
            userRepositoryMock.findById.mockResolvedValueOnce(null)
            let error

            // Act
            try {
                await userService.getUserById(id)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).message).toBe(ExceptionStatus.notFound)
            expect(userRepositoryMock.findById).toHaveBeenCalledWith(id)
        })
    })

    describe('getUserMissions', () => {
        it('should return the active and completed missions', async () => {
            // Arrange
            const id = '412312312'
            missionRepositoryMock.findActiveMissions.mockResolvedValueOnce([
                mission,
                { ...mission, name: 'Foo', _id: '12345', participants: [id] }
            ])
            missionRepositoryMock.findUserCompletedMissions.mockResolvedValueOnce([
                { ...mission, name: 'Bar', _id: '12346', completers: [id] }
            ])

            // Act
            const result = await userService.getUserMissions(id)

            // Assert
            expect(missionRepositoryMock.findActiveMissions).toHaveBeenCalledWith(id)
            expect(missionRepositoryMock.findUserCompletedMissions).toHaveBeenCalledWith(id)
            expect(result).toEqual({
                active: [{ ...userMission, participating: false }, { ...userMission, name: 'Foo', _id: '12345', participating: true }],
                completed: [{ ...userMission, name: 'Bar', _id: '12346' }]
            })
        })
    })

    describe('getUserRewards', () => {
        it('should return the user available, claimed and received rewards', async () => {
            // Arrange
            const id = '412312312'
            rewardRepositoryMock.findAvailableRewards.mockResolvedValueOnce([reward])
            rewardRepositoryMock.findClaimedRewards.mockResolvedValueOnce([
                { ...reward, name: 'Foo', _id: '12345', claimers: [id] },
                { ...reward, name: 'Beer', _id: '1234551451', claimers: [id, id, "not-id"] }
            ])
            rewardRepositoryMock.findHandedRewards.mockResolvedValueOnce([
                { ...reward, name: 'Bar', _id: '12346', handed: [id, id] }
            ])

            // Act
            const result = await userService.getUserRewards(id)

            // Assert
            expect(rewardRepositoryMock.findAvailableRewards).toHaveBeenCalled()
            expect(rewardRepositoryMock.findClaimedRewards).toHaveBeenCalledWith(id)
            expect(rewardRepositoryMock.findHandedRewards).toHaveBeenCalledWith(id)
            expect(result).toEqual({
                available: [userReward],
                claimed: [{ ...userReward, name: 'Foo', _id: '12345', count: 1 }, { ...userReward, name: 'Beer', _id: '1234551451', count: 2 }],
                received: [{ ...userReward, name: 'Bar', _id: '12346', count: 2 }]
            })
        })
    })

    describe('addUser', () => {
        it('should add the user', async () => {
            // Arrange
            const user: Partial<User> = { name: 'John Doe' }

            // Act
            await userService.addUser(user)

            // Assert
            expect(userRepositoryMock.create).toHaveBeenCalledWith(user)
        })
    })

    describe('deleteUser', () => {
        it('should delete the user', async () => {
            // Arrange
            const id = 'f94fbe96-373e-49b1-81c0-0df716e9b2ee'

            // Act
            await userService.deleteUser(id)

            // Assert
            expect(userRepositoryMock.delete).toHaveBeenCalledWith(id)
        })
    })
})