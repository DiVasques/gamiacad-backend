import { MissionService } from '@/services/MissionService'
import { Mission } from '@/models/Mission'
import { missionList } from '../mocks/Mission'

describe('MissionService', () => {
    let missionService: MissionService
    let missionRepositoryMock: any

    beforeEach(() => {
        missionRepositoryMock = {
            find: jest.fn().mockResolvedValue(missionList),
            create: jest.fn()
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
})