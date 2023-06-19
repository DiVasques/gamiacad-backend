import app from '@/app'
import request from 'supertest'
import { userList } from '../mocks/User'
import { Container } from "typedi"

describe('UserController', () => {
    const userServiceMock = {
        getUsers: jest.fn().mockResolvedValue(userList),
        addUser: jest.fn(),
    }

    beforeEach(() => {
        const containerMock = {
            get: jest.fn().mockReturnValue(userServiceMock),
        }
        Container.get = containerMock.get
    })

    afterEach(() =>
        jest.clearAllMocks()
    )

    describe('getUsers', () => {
        it('should return a list of users', async () => {
            // Arrange

            // Act
            const { status, body } = await request(app)
                .get(`/api/user`)

            // Assert
            const expectedUsers = userList.map((user) => ({
                ...user,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
            }))

            expect(userServiceMock.getUsers).toHaveBeenCalled()
            expect(status).toBe(200)
            expect(body).toEqual({ users: expectedUsers })
        })
    })

    describe('addUser', () => {
        it('should return a response with status code 201', async () => {
            // Arrange
            const newUser = { name: 'John Doe', email: 'johndoe@example.com' }

            // Act
            const { status } = await request(app)
                .post(`/api/user`).send(newUser)

            // Assert
            expect(userServiceMock.addUser).toHaveBeenCalledWith(newUser)
            expect(status).toBe(201)
        })
    })
})
