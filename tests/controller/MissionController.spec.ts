import app from '@/app'
import request from 'supertest'
import { missionList } from '../mocks/Mission'
import { Container } from 'typedi'
import AppError from '@/models/error/AppError'
import ExceptionStatus from '@/utils/enum/ExceptionStatus'
import { adminHeaders, userHeaders, userId as authorizedUser, unauthorizedUserId } from '../mocks/DefaultHeaders'

describe('MissionController', () => {
    const missionServiceMock = {
        getMissions: jest.fn().mockResolvedValue(missionList),
        addMission: jest.fn(),
        deleteMission: jest.fn(),
        subscribeUser: jest.fn(),
        completeMission: jest.fn()
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

    const id = '99cc0b92-354a-4264-b841-d88bd1f5dc20'

    describe('getMissions', () => {
        it('should return a list of missions', async () => {
            // Arrange

            // Act
            const { status, body } = await request(app)
                .get('/api/mission')
                .set(adminHeaders)

            // Assert
            const expectedMissions = missionList.map((mission) => ({
                ...mission,
                expirationDate: mission.expirationDate.toISOString(),
                createdAt: mission.createdAt.toISOString(),
                updatedAt: mission.updatedAt.toISOString(),
            }))

            expect(status).toBe(200)
            expect(missionServiceMock.getMissions).toHaveBeenCalled()
            expect(body).toEqual({ missions: expectedMissions })
        })

        it('should return 403 if user is forbidden', async () => {
            // Arrange

            // Act
            const { status } = await request(app)
                .get('/api/mission')
                .set(userHeaders)

            // Assert
            expect(status).toBe(403)
            expect(missionServiceMock.getMissions).not.toBeCalled()
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
                .post('/api/mission')
                .set(adminHeaders)
                .send(newMission)

            // Assert
            expect(status).toBe(201)
            expect(missionServiceMock.addMission).toHaveBeenCalledWith(newMission)
        })

        it('should return 403 if user is forbidden', async () => {
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
                .post('/api/mission')
                .set(userHeaders)
                .send(newMission)

            // Assert
            expect(status).toBe(403)
            expect(missionServiceMock.addMission).not.toBeCalled()
        })
    })

    describe('deleteMission', () => {
        it('should return a response with status code 204', async () => {
            // Arrange

            // Act
            const { status } = await request(app)
                .delete(`/api/mission/${id}`)
                .set(adminHeaders)

            // Assert
            expect(status).toBe(204)
            expect(missionServiceMock.deleteMission).toHaveBeenCalledWith(id)
        })

        it('should return 404 if no mission was found', async () => {
            // Arrange
            missionServiceMock.deleteMission.mockRejectedValueOnce(new AppError(ExceptionStatus.notFound, 404))

            // Act
            const { status } = await request(app)
                .delete(`/api/mission/${id}`)
                .set(adminHeaders)

            // Assert
            expect(status).toBe(404)
            expect(missionServiceMock.deleteMission).toHaveBeenCalledWith(id)
        })

        it('should return 400 if mission has completers', async () => {
            // Arrange
            missionServiceMock.deleteMission.mockRejectedValueOnce(new AppError(ExceptionStatus.invalidRequest, 400))

            // Act
            const { status } = await request(app)
                .delete(`/api/mission/${id}`)
                .set(adminHeaders)

            // Assert
            expect(status).toBe(400)
            expect(missionServiceMock.deleteMission).toHaveBeenCalledWith(id)
        })

        it('should return 403 if user is forbidden', async () => {
            // Arrange

            // Act
            const { status } = await request(app)
                .delete(`/api/mission/${id}`)
                .set(userHeaders)

            // Assert
            expect(status).toBe(403)
            expect(missionServiceMock.deleteMission).not.toBeCalled()
        })
    })

    describe('subscribeUser', () => {
        it('should return a response with status code 204', async () => {
            // Arrange
            const userId = authorizedUser

            // Act
            const { status } = await request(app)
                .put(`/api/mission/${id}/${userId}`)
                .set(userHeaders)

            // Assert
            expect(status).toBe(204)
            expect(missionServiceMock.subscribeUser).toHaveBeenCalledWith(id, userId)
        })

        it('should return 404 if no mission or user was found', async () => {
            // Arrange
            const userId = authorizedUser

            missionServiceMock.subscribeUser.mockRejectedValueOnce(new AppError(ExceptionStatus.notFound, 404))

            // Act
            const { status } = await request(app)
                .put(`/api/mission/${id}/${userId}`)
                .set(userHeaders)

            // Assert
            expect(status).toBe(404)
            expect(missionServiceMock.subscribeUser).toHaveBeenCalledWith(id, userId)
        })

        it('should return 400 if user already participating on the mission', async () => {
            // Arrange
            const userId = authorizedUser
            missionServiceMock.subscribeUser.mockRejectedValueOnce(new AppError(ExceptionStatus.invalidRequest, 400))

            // Act
            const { status } = await request(app)
                .put(`/api/mission/${id}/${userId}`)
                .set(userHeaders)

            // Assert
            expect(status).toBe(400)
            expect(missionServiceMock.subscribeUser).toHaveBeenCalledWith(id, userId)
        })

        it('should return 403 if user is forbidden', async () => {
            // Arrange
            const userId = unauthorizedUserId

            // Act
            const { status } = await request(app)
                .put(`/api/mission/${id}/${userId}`)
                .set(userHeaders)

            // Assert
            expect(status).toBe(403)
            expect(missionServiceMock.subscribeUser).not.toBeCalled()
        })
    })

    describe('completeMission', () => {
        it('should return a response with status code 204', async () => {
            // Arrange
            const userId = authorizedUser

            // Act
            const { status } = await request(app)
                .patch(`/api/mission/${id}/${userId}`)
                .set(adminHeaders)

            // Assert
            expect(status).toBe(204)
            expect(missionServiceMock.completeMission).toHaveBeenCalledWith(id, userId)
        })

        it('should return 404 if no mission or user was found', async () => {
            // Arrange
            const userId = authorizedUser

            missionServiceMock.completeMission.mockRejectedValueOnce(new AppError(ExceptionStatus.notFound, 404))

            // Act
            const { status } = await request(app)
                .patch(`/api/mission/${id}/${userId}`)
                .set(adminHeaders)

            // Assert
            expect(status).toBe(404)
            expect(missionServiceMock.completeMission).toHaveBeenCalledWith(id, userId)
        })

        it('should return 400 if user not participating or already completed the mission', async () => {
            // Arrange
            const userId = authorizedUser
            missionServiceMock.completeMission.mockRejectedValueOnce(new AppError(ExceptionStatus.invalidRequest, 400))

            // Act
            const { status } = await request(app)
                .patch(`/api/mission/${id}/${userId}`)
                .set(adminHeaders)

            // Assert
            expect(status).toBe(400)
            expect(missionServiceMock.completeMission).toHaveBeenCalledWith(id, userId)
        })

        it('should return 403 if user is forbidden', async () => {
            // Arrange
            const userId = authorizedUser
            missionServiceMock.completeMission.mockRejectedValueOnce(new AppError(ExceptionStatus.invalidRequest, 400))

            // Act
            const { status } = await request(app)
                .patch(`/api/mission/${id}/${userId}`)
                .set(userHeaders)

            // Assert
            expect(status).toBe(403)
            expect(missionServiceMock.completeMission).not.toBeCalled()
        })
    })
})
