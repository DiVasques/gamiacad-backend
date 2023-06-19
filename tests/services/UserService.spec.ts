import { UserService } from '@/services/UserService'
import { userList } from '../mocks/User'
import { User } from '@/models/User'

describe('UserService', () => {
    const userRepositoryMock = {
        find: jest.fn().mockResolvedValue(userList),
        create: jest.fn(),
    }

    afterEach(() =>
        jest.clearAllMocks()
    )

    describe('getUsers', () => {
        it('should return users from the repository', async () => {
            // Arrange
            const userService = new UserService()
            userService['userRepository'] = userRepositoryMock as any

            const filter = { name: 'name' }

            // Act
            const result = await userService.getUsers(filter)

            // Assert
            expect(userRepositoryMock.find).toHaveBeenCalledWith(filter)
            expect(result).toEqual(userList)
        })
    })

    describe('addUser', () => {
        it('should add the user', async () => {
            // Arrange
            const userService = new UserService()
            userService['userRepository'] = userRepositoryMock as any
            const user: Partial<User> = { name: 'John Doe' }

            // Act
            await userService.addUser(user)

            // Assert
            expect(userRepositoryMock.create).toHaveBeenCalledWith(user)
        })
    })
})