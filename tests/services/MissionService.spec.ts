import { MissionService } from '@/services/MissionService'
import { Mission } from '@/models/Mission'
import { editMission, mission, missionList } from '../mocks/Mission'
import { user } from '../mocks/User'
import AppError from '@/models/error/AppError'

describe('MissionService', () => {
    let missionService: MissionService
    let missionRepositoryMock: any
    let userRepositoryMock: any

    beforeEach(() => {
        missionRepositoryMock = {
            find: jest.fn().mockResolvedValue(missionList),
            create: jest.fn(),
            update: jest.fn(),
            findById: jest.fn().mockResolvedValue(mission),
            deactivateMission: jest.fn(),
            subscribeUser: jest.fn().mockResolvedValue(1),
            completeMission: jest.fn().mockResolvedValue(1)
        }
        userRepositoryMock = {
            findById: jest.fn().mockResolvedValue(user),
            givePoints: jest.fn()
        }
        missionService = new MissionService()
        missionService['missionRepository'] = missionRepositoryMock
        missionService['userRepository'] = userRepositoryMock
    })

    afterEach(() =>
        jest.clearAllMocks()
    )

    describe('getMissions', () => {
        it('should return missions from the repository', async () => {
            // Arrange
            const filter = { name: 'name' }

            // Act
            const result = await missionService.getMissions(filter)

            // Assert
            expect(missionRepositoryMock.find).toHaveBeenCalledWith(filter)
            expect(result).toEqual(missionList)
        })
    })

    describe('addMission', () => {
        it('should add the mission', async () => {
            // Arrange
            const mission: Partial<Mission> = {
                name: 'Mission 1',
                description: 'this is a description',
                points: 150,
                expirationDate: new Date(9999999999999),
                createdBy: '1b6ec50e-9be1-459f-bd69-11bfa325d03b'
            }

            // Act
            await missionService.addMission(mission)

            // Assert
            expect(missionRepositoryMock.create).toHaveBeenCalledWith(mission)
        })
    })

    describe('editMission', () => {
        it('should throw an error if the mission is not found', async () => {
            // Arrange
            const id = '123'
            missionRepositoryMock.findById.mockResolvedValue(null)
            let error

            // Act
            try {
                await missionService.editMission(id, editMission)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).status).toBe(404)
            expect(missionRepositoryMock.findById).toHaveBeenCalledWith(id)
        })

        it('should throw an error if the expiration is less than the original', async () => {
            // Arrange
            const id = '123'
            const invalidEditMission = { ...editMission, expirationDate: new Date('2003-06-25T20:20:14.000Z') }
            let error

            // Act
            try {
                await missionService.editMission(id, invalidEditMission)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).status).toBe(400)
            expect(missionRepositoryMock.findById).toHaveBeenCalledWith(id)
        })

        it('should update the mission if it exists', async () => {
            // Arrange
            const id = '123'

            // Act
            await missionService.editMission(id, editMission)

            // Assert
            expect(missionRepositoryMock.findById).toHaveBeenCalledWith(id)
            expect(missionRepositoryMock.update).toHaveBeenCalledWith(id, editMission)
        })
    })

    describe('deactivateMission', () => {
        it('should throw an error if the mission is not found', async () => {
            // Arrange
            const id = '123'
            missionRepositoryMock.findById.mockResolvedValue(null)
            let error

            // Act
            try {
                await missionService.deactivateMission(id)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).status).toBe(404)
            expect(missionRepositoryMock.findById).toHaveBeenCalledWith(id)
        })

        it('should deactivate the mission if it exists', async () => {
            // Arrange
            const id = '123'

            // Act
            await missionService.deactivateMission(id)

            // Assert
            expect(missionRepositoryMock.findById).toHaveBeenCalledWith(id)
            expect(missionRepositoryMock.deactivateMission).toHaveBeenCalledWith(id)
        })
    })

    describe('subscribeUser', () => {
        it('should throw an error if the mission was not found', async () => {
            // Arrange
            const id = '123'
            const userId = '456'
            missionRepositoryMock.findById.mockResolvedValue(null)
            let error

            // Act
            try {
                await missionService.subscribeUser(id, userId)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).status).toBe(404)
            expect(missionRepositoryMock.findById).toHaveBeenCalledWith(id)
            expect(missionRepositoryMock.subscribeUser).not.toHaveBeenCalled()
        })
        it('should throw an error if the user was not found', async () => {
            // Arrange
            const id = '123'
            const userId = '456'
            userRepositoryMock.findById.mockResolvedValue(null)
            let error

            // Act
            try {
                await missionService.subscribeUser(id, userId)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).status).toBe(404)
            expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId)
            expect(missionRepositoryMock.subscribeUser).not.toHaveBeenCalled()
        })

        it('should throw an error if the user already participates on the mission', async () => {
            // Arrange
            const id = '123'
            const userId = '456'
            missionRepositoryMock.subscribeUser.mockResolvedValue(0)
            let error

            // Act
            try {
                await missionService.subscribeUser(id, userId)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).status).toBe(400)
            expect(missionRepositoryMock.findById).toHaveBeenCalledWith(id)
            expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId)
            expect(missionRepositoryMock.subscribeUser).toHaveBeenCalledWith(id, userId)
        })

        it('should subscribe the user', async () => {
            // Arrange
            const id = '123'
            const userId = '456'

            // Act
            await missionService.subscribeUser(id, userId)

            // Assert
            expect(missionRepositoryMock.findById).toHaveBeenCalledWith(id)
            expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId)
            expect(missionRepositoryMock.subscribeUser).toHaveBeenCalledWith(id, userId)
        })
    })

    describe('completeMission', () => {
        it('should throw an error if the mission was not found', async () => {
            // Arrange
            const id = '123'
            const userId = '456'
            missionRepositoryMock.findById.mockResolvedValue(null)
            let error

            // Act
            try {
                await missionService.completeMission(id, userId)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).status).toBe(404)
            expect(missionRepositoryMock.findById).toHaveBeenCalledWith(id)
            expect(missionRepositoryMock.completeMission).not.toHaveBeenCalled()
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
                await missionService.completeMission(id, userId)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).status).toBe(404)
            expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId)
            expect(missionRepositoryMock.completeMission).not.toHaveBeenCalled()
            expect(userRepositoryMock.givePoints).not.toHaveBeenCalled()
        })

        it('should throw an error if the user is not participating or already completed the mission', async () => {
            // Arrange
            const id = '123'
            const userId = '456'
            missionRepositoryMock.completeMission.mockResolvedValue(0)
            let error

            // Act
            try {
                await missionService.completeMission(id, userId)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).status).toBe(400)
            expect(missionRepositoryMock.findById).toHaveBeenCalledWith(id)
            expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId)
            expect(missionRepositoryMock.completeMission).toHaveBeenCalledWith(id, userId)
            expect(userRepositoryMock.givePoints).not.toHaveBeenCalled()
        })

        it('should subscribe the user', async () => {
            // Arrange
            const id = '123'
            const userId = '456'

            // Act
            await missionService.completeMission(id, userId)

            // Assert
            expect(missionRepositoryMock.findById).toHaveBeenCalledWith(id)
            expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId)
            expect(missionRepositoryMock.completeMission).toHaveBeenCalledWith(id, userId)
            expect(userRepositoryMock.givePoints).toHaveBeenCalledWith(userId, mission.points)
        })
    })
})