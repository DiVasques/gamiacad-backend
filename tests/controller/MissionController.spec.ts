import app from '@/app'
import request from 'supertest'
import { missionList } from '../mocks/Mission'
import { Container } from 'typedi'
import AppError from '@/models/error/AppError'
import ExceptionStatus from '@/utils/enum/ExceptionStatus'

describe('MissionController', () => {
    const missionServiceMock = {
        getMissions: jest.fn().mockResolvedValue(missionList),
        addMission: jest.fn(),
        deleteMission: jest.fn(),
        subscribeUser: jest.fn()
    }

    beforeEach(() => {
        const containerMock = {
            get: jest.fn().mockReturnValue(missionServiceMock),
        }
        Container.get = containerMock.get
    })

    afterEach(() =>
        jest.clearAllMocks()
    )

    describe('getMissions', () => {
        it('should return a list of missions', async () => {
            // Arrange

            // Act
            const { status, body } = await request(app)
                .get(`/api/mission`)

            // Assert
            const expectedMissions = missionList.map((mission) => ({
                ...mission,
                expirationDate: mission.expirationDate.toISOString(),
                createdAt: mission.createdAt.toISOString(),
                updatedAt: mission.updatedAt.toISOString(),
            }))

            expect(missionServiceMock.getMissions).toHaveBeenCalled()
            expect(status).toBe(200)
            expect(body).toEqual({ missions: expectedMissions })
        })
    })

    describe('addMission', () => {
        it('should return a response with status code 201', async () => {
            // Arrange
            const newMission = {
                name: 'Mission 1',
                description: 'this is a description',
                points: 150,
                expirationDate: new Date(9999999999999),
                createdBy: '1b6ec50e-9be1-459f-bd69-11bfa325d03b'
            }

            // Act
            const { status } = await request(app)
                .post(`/api/mission`).send(newMission)

            // Assert
            expect(missionServiceMock.addMission).toHaveBeenCalledWith(newMission)
            expect(status).toBe(201)
        })
    })

    describe('deleteMission', () => {
        it('should return a response with status code 204', async () => {
            // Arrange
            const id = 'f94fbe96-373e-49b1-81c0-0df716e9b2ee'

            // Act
            const { status } = await request(app)
                .delete(`/api/mission/${id}`)

            // Assert
            expect(status).toBe(204)
            expect(missionServiceMock.deleteMission).toHaveBeenCalledWith(id)
        })

        it('should return 404 if no mission was found', async () => {
            // Arrange
            const id = 'f94fbe96-373e-49b1-81c0-0df716e9b2ee'
            missionServiceMock.deleteMission.mockRejectedValueOnce(new AppError(ExceptionStatus.notFound, 404))

            // Act
            const { status } = await request(app)
                .delete(`/api/mission/${id}`)

            // Assert
            expect(status).toBe(404)
            expect(missionServiceMock.deleteMission).toHaveBeenCalledWith(id)
        })

        it('should return 400 if mission has completers', async () => {
            // Arrange
            const id = 'f94fbe96-373e-49b1-81c0-0df716e9b2ee'
            missionServiceMock.deleteMission.mockRejectedValueOnce(new AppError(ExceptionStatus.invalidRequest, 400))

            // Act
            const { status } = await request(app)
                .delete(`/api/mission/${id}`)

            // Assert
            expect(status).toBe(400)
            expect(missionServiceMock.deleteMission).toHaveBeenCalledWith(id)
        })
    })

    describe('subscribeUser', () => {
        it('should return a response with status code 204', async () => {
            // Arrange
            const id = 'f94fbe96-373e-49b1-81c0-0df716e9b2ee'
            const userId = '9c4276a4-0d1d-4a93-90ba-41394d8b4972'

            // Act
            const { status } = await request(app)
                .put(`/api/mission/${id}/${userId}`)

            // Assert
            expect(status).toBe(204)
            expect(missionServiceMock.subscribeUser).toHaveBeenCalledWith(id, userId)
        })

        it('should return 404 if no mission or user was found', async () => {
            // Arrange
            const id = 'f94fbe96-373e-49b1-81c0-0df716e9b2ee'
            const userId = '9c4276a4-0d1d-4a93-90ba-41394d8b4972'

            missionServiceMock.subscribeUser.mockRejectedValueOnce(new AppError(ExceptionStatus.notFound, 404))

            // Act
            const { status } = await request(app)
                .put(`/api/mission/${id}/${userId}`)

            // Assert
            expect(status).toBe(404)
            expect(missionServiceMock.subscribeUser).toHaveBeenCalledWith(id, userId)
        })

        it('should return 400 if user already participating on the mission', async () => {
            // Arrange
            const id = 'f94fbe96-373e-49b1-81c0-0df716e9b2ee'
            const userId = '9c4276a4-0d1d-4a93-90ba-41394d8b4972'
            missionServiceMock.subscribeUser.mockRejectedValueOnce(new AppError(ExceptionStatus.invalidRequest, 400))

            // Act
            const { status } = await request(app)
                .put(`/api/mission/${id}/${userId}`)

            // Assert
            expect(status).toBe(400)
            expect(missionServiceMock.subscribeUser).toHaveBeenCalledWith(id, userId)
        })
    })
})
