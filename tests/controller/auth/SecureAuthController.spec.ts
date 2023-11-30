import app from '@/app'
import request from 'supertest'
import { Container } from 'typedi'
import { adminHeaders, userHeaders } from '../../mocks/DefaultHeaders'

describe('SecureAuthController', () => {
    const secureAuthServiceMock = {
        updateAdminPrivileges: jest.fn()
    }

    beforeEach(() => {
        const containerMock = {
            get: jest.fn().mockReturnValue(secureAuthServiceMock),
        }
        Container.get = containerMock.get
        app.enable('trust proxy')
    })

    afterEach(() =>
        jest.clearAllMocks()
    )

    const userId = '99cc0b92-354a-4264-b841-d88bd1f5dc20'

    describe('updateAdminPrivileges', () => {
        it('should update user privileges', async () => {
            // Arrange
            const admin = true

            // Act
            const { status } = await request(app)
                .patch(`/api/admin/${userId}`)
                .send({ admin })
                .set(adminHeaders)

            // Assert
            expect(status).toBe(204)
            expect(secureAuthServiceMock.updateAdminPrivileges).toHaveBeenCalledWith(userId, admin)
        })

        it('should return 403 if user is forbidden', async () => {
            // Arrange
            const admin = true

            // Act
            const { status } = await request(app)
                .patch(`/api/admin/${userId}`)
                .send({ admin })
                .set(userHeaders)

            // Assert
            expect(status).toBe(403)
            expect(secureAuthServiceMock.updateAdminPrivileges).not.toBeCalled()
        })
    })
})
