import { MissionService } from '@/services/MissionService'
import { Mission } from '@/models/Mission'
import { mission, missionList } from '../mocks/Mission'
import AppError from '@/models/error/AppError'

describe('MissionService', () => {
    let missionService: MissionService
    let missionRepositoryMock: any

    beforeEach(() => {
        missionRepositoryMock = {
            find: jest.fn().mockResolvedValue(missionList),
            create: jest.fn(),
            findById: jest.fn().mockResolvedValue(mission),
            delete: jest.fn()
        }
        missionService = new MissionService()
        missionService['missionRepository'] = missionRepositoryMock
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

    describe('deleteMission', () => {
        it('should throw an error if the mission is not found', async () => {
            // Arrange
            const id = '123'
            missionRepositoryMock.findById.mockResolvedValue(null)
            let error

            // Act
            try {
                await missionService.deleteMission(id)
            } catch (e) {
                error = e
            }
            
            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).status).toBe(404)
            expect(missionRepositoryMock.findById).toHaveBeenCalledWith(id)
        })

        it('should throw an error if the mission has completers', async () => {
            // Arrange
            const id = '123'
            const missionWithCompleters = {
                id: '123',
                completers: ['user1', 'user2']
            }
            missionRepositoryMock.findById.mockResolvedValue(missionWithCompleters)
            let error

            // Act
            try {
                await missionService.deleteMission(id)
            } catch (e) {
                error = e
            }
            
            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).status).toBe(400)
            expect(missionRepositoryMock.findById).toHaveBeenCalledWith(id)
        })

        it('should delete the mission if it exists and has no completers', async () => {
            // Arrange
            const id = '123'

            // Act
            await missionService.deleteMission(id)

            // Assert
            expect(missionRepositoryMock.findById).toHaveBeenCalledWith(id)
            expect(missionRepositoryMock.delete).toHaveBeenCalledWith(id)
        })
    })
})