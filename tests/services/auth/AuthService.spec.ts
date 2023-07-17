import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { AuthService } from '@/services/auth/AuthService'
import { userAuth } from '../../mocks/UserAuth'
import { refreshToken } from '../../mocks/RefreshToken'
import AppError from '@/models/error/AppError'
import ExceptionStatus from '@/utils/enum/ExceptionStatus'
import { TokenPayload } from '@/models/auth/TokenPayload'

describe('AuthService', () => {
    let authService: AuthService
    let authRepositoryMock: any
    let refreshTokenRepositoryMock: any

    beforeEach(() => {
        authRepositoryMock = {
            findById: jest.fn(),
            registerUser: jest.fn().mockResolvedValue(userAuth)
        }
        refreshTokenRepositoryMock = {
            findById: jest.fn(),
            create: jest.fn(),
            delete: jest.fn()
        }
        authService = new AuthService()
        authService['authRepository'] = authRepositoryMock
        authService['refreshTokenRepository'] = refreshTokenRepositoryMock
        process.env.ACCESS_TOKEN_SECRET = 'access-token-secret'
        process.env.REFRESH_TOKEN_SECRET = 'refresh-token-secret'
    })

    afterEach(() =>
        jest.clearAllMocks()
    )

    const newUser = { registration: '12345678901', password: 'Passw0rd!$!@#' }
    const clientIp = '255.255.255.0'

    describe('registerUser', () => {
        it('should register and return the user tokens', async () => {
            // Arrange
            jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashed-password' as never)
            const signMock = jest.spyOn(jwt, 'sign').mockReturnValue('jwt-token' as never)

            // Act
            const result = await authService.registerUser(newUser, clientIp)

            // Assert
            expect(authRepositoryMock.findById).toHaveBeenCalledWith(newUser.registration)
            expect(authRepositoryMock.registerUser).toHaveBeenCalledWith({
                _id: newUser.registration,
                password: 'hashed-password',
            })
            expect(signMock).toHaveBeenCalledWith(
                { sub: userAuth.uuid, roles: userAuth.roles } as TokenPayload,
                'access-token-secret',
                { expiresIn: '30s' }
            )
            expect(signMock).toHaveBeenCalledWith(
                { sub: userAuth.uuid, roles: userAuth.roles } as TokenPayload,
                'refresh-token-secret',
                { expiresIn: '7d' }
            )
            expect(result.accessToken).toBe('jwt-token')
            expect(result.userId).toBe(userAuth.uuid)
            expect(refreshTokenRepositoryMock.delete).toHaveBeenCalledWith(userAuth.uuid)
            expect(refreshTokenRepositoryMock.create).toHaveBeenCalledWith({
                _id: userAuth.uuid,
                clientIp,
                token: 'jwt-token'
             })
        })

        it('should throw an error if ACCESS_TOKEN_SECRET env is not set', async () => {
            // Arrange
            delete process.env.ACCESS_TOKEN_SECRET
            let error

            // Act
            try {
                await authService.registerUser(newUser, clientIp)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).message).toBe(ExceptionStatus.serviceUnavailable)
            expect((error as AppError).status).toBe(503)
            expect(authRepositoryMock.findById).not.toBeCalled()
            expect(authRepositoryMock.registerUser).not.toBeCalled()
        })

        it('should throw an error if REFRESH_TOKEN_SECRET env is not set', async () => {
            // Arrange
            delete process.env.REFRESH_TOKEN_SECRET
            let error

            // Act
            try {
                await authService.registerUser(newUser, clientIp)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).message).toBe(ExceptionStatus.serviceUnavailable)
            expect((error as AppError).status).toBe(503)
            expect(authRepositoryMock.findById).not.toBeCalled()
            expect(authRepositoryMock.registerUser).not.toBeCalled()
        })

        it('should throw 409 if user already registered', async () => {
            // Arrange
            let error
            authRepositoryMock.findById.mockResolvedValueOnce(userAuth)

            // Act
            try {
                await authService.registerUser(newUser, clientIp)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).message).toBe(ExceptionStatus.accountExists)
            expect((error as AppError).status).toBe(409)
            expect(authRepositoryMock.findById).toHaveBeenCalledWith(newUser.registration)
            expect(authRepositoryMock.registerUser).not.toBeCalled()
        })
    })

    describe('loginUser', () => {
        it('should return the user tokens', async () => {
            // Arrange
            authRepositoryMock.findById.mockResolvedValueOnce(userAuth)
            jest.spyOn(bcrypt, 'compareSync').mockReturnValueOnce(true as never)
            const signMock = jest.spyOn(jwt, 'sign').mockReturnValue('jwt-token' as never)

            // Act
            const result = await authService.loginUser(newUser, clientIp)

            // Assert
            expect(authRepositoryMock.findById).toHaveBeenCalledWith(newUser.registration)
            expect(signMock).toHaveBeenCalledWith(
                { sub: userAuth.uuid, roles: userAuth.roles } as TokenPayload,
                'access-token-secret',
                { expiresIn: '30s' }
            )
            expect(signMock).toHaveBeenCalledWith(
                { sub: userAuth.uuid, roles: userAuth.roles } as TokenPayload,
                'refresh-token-secret',
                { expiresIn: '7d' }
            )
            expect(result.accessToken).toBe('jwt-token')
            expect(result.userId).toBe(userAuth.uuid)
            expect(refreshTokenRepositoryMock.delete).toHaveBeenCalledWith(userAuth.uuid)
            expect(refreshTokenRepositoryMock.create).toHaveBeenCalledWith({
                _id: userAuth.uuid,
                clientIp,
                token: 'jwt-token'
             })
        })

        it('should throw an error if ACCESS_TOKEN_SECRET env is not set', async () => {
            // Arrange
            delete process.env.ACCESS_TOKEN_SECRET
            let error

            // Act
            try {
                await authService.loginUser(newUser, clientIp)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).message).toBe(ExceptionStatus.serviceUnavailable)
            expect((error as AppError).status).toBe(503)
            expect(authRepositoryMock.findById).not.toBeCalled()
        })

        it('should throw an error if REFRESH_TOKEN_SECRET env is not set', async () => {
            // Arrange
            delete process.env.REFRESH_TOKEN_SECRET
            let error

            // Act
            try {
                await authService.loginUser(newUser, clientIp)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).message).toBe(ExceptionStatus.serviceUnavailable)
            expect((error as AppError).status).toBe(503)
            expect(authRepositoryMock.findById).not.toBeCalled()
        })

        it('should throw 401 if user does not exists', async () => {
            // Arrange
            let error

            // Act
            try {
                await authService.loginUser(newUser, clientIp)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).message).toBe(ExceptionStatus.invalidCredentials)
            expect((error as AppError).status).toBe(401)
            expect(authRepositoryMock.findById).toHaveBeenCalledWith(newUser.registration)
        })

        it('should throw 401 if password does not match', async () => {
            // Arrange
            authRepositoryMock.findById.mockResolvedValueOnce(userAuth)
            jest.spyOn(bcrypt, 'compareSync').mockReturnValueOnce(false as never)
            let error

            // Act
            try {
                await authService.loginUser(newUser, clientIp)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).message).toBe(ExceptionStatus.invalidCredentials)
            expect((error as AppError).status).toBe(401)
            expect(authRepositoryMock.findById).toHaveBeenCalledWith(newUser.registration)
        })
    })

    describe('refreshToken', () => {
        it('should refresh and return the user tokens', async () => {
            // Arrange
            refreshTokenRepositoryMock.findById.mockResolvedValueOnce(refreshToken)
            const verifyMock = jest.spyOn(jwt, 'verify').mockReturnValue(undefined)
            const decodeMock = jest.spyOn(jwt, 'decode').mockReturnValue({ sub: 'user-id', roles: ['user'] } as TokenPayload)
            const signMock = jest.spyOn(jwt, 'sign').mockReturnValue('jwt-token' as never)

            // Act
            const result = await authService.refreshToken(refreshToken.token, clientIp)

            // Assert
            expect(refreshTokenRepositoryMock.findById).toHaveBeenCalledWith('user-id')
            expect(signMock).toHaveBeenCalledWith(
                { sub: 'user-id', roles: userAuth.roles } as TokenPayload,
                'access-token-secret',
                { expiresIn: '30s' }
            )
            expect(signMock).toHaveBeenCalledWith(
                { sub: 'user-id', roles: userAuth.roles } as TokenPayload,
                'refresh-token-secret',
                { expiresIn: '2d' }
            )
            expect(verifyMock).toHaveBeenCalledWith(refreshToken.token, 'refresh-token-secret')
            expect(decodeMock).toHaveBeenCalledWith(refreshToken.token)
            expect(refreshTokenRepositoryMock.delete).toHaveBeenCalledWith('user-id')
            expect(refreshTokenRepositoryMock.create).toHaveBeenCalledWith({
                _id: 'user-id',
                clientIp,
                token: 'jwt-token'
             })
            expect(result.accessToken).toBe('jwt-token')
            expect(result.refreshToken).toBe('jwt-token')
            expect(result.userId).toBe('user-id')
        })

        it('should throw an error if ACCESS_TOKEN_SECRET env is not set', async () => {
            // Arrange
            delete process.env.ACCESS_TOKEN_SECRET
            let error

            // Act
            try {
                await authService.refreshToken(refreshToken.token, clientIp)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).message).toBe(ExceptionStatus.serviceUnavailable)
            expect((error as AppError).status).toBe(503)
            expect(refreshTokenRepositoryMock.findById).not.toBeCalled()
        })

        it('should throw an error if REFRESH_TOKEN_SECRET env is not set', async () => {
            // Arrange
            delete process.env.REFRESH_TOKEN_SECRET
            let error

            // Act
            try {
                await authService.refreshToken(refreshToken.token, clientIp)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).message).toBe(ExceptionStatus.serviceUnavailable)
            expect((error as AppError).status).toBe(503)
            expect(refreshTokenRepositoryMock.findById).not.toBeCalled()
        })

        it('should throw 401 if token is not on database', async () => {
            // Arrange
            const verifyMock = jest.spyOn(jwt, 'verify').mockReturnValue(undefined)
            const decodeMock = jest.spyOn(jwt, 'decode').mockReturnValue({ sub: 'user-id', roles: ['user'] } as TokenPayload)
            let error

            // Act
            try {
                await authService.refreshToken(refreshToken.token, clientIp)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).message).toBe(ExceptionStatus.invalidToken)
            expect((error as AppError).status).toBe(401)
            expect(verifyMock).toHaveBeenCalledWith(refreshToken.token, 'refresh-token-secret')
            expect(decodeMock).toHaveBeenCalledWith(refreshToken.token)
            expect(refreshTokenRepositoryMock.findById).toHaveBeenCalledWith('user-id')
        })

        it('should throw 401 if tokens does not match', async () => {
            // Arrange
            refreshTokenRepositoryMock.findById.mockResolvedValueOnce(refreshToken)
            const verifyMock = jest.spyOn(jwt, 'verify').mockReturnValue(undefined)
            const decodeMock = jest.spyOn(jwt, 'decode').mockReturnValue({ sub: 'user-id', roles: ['user'] } as TokenPayload)
            let error

            // Act
            try {
                await authService.refreshToken('invalid-token', clientIp)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).message).toBe(ExceptionStatus.invalidToken)
            expect((error as AppError).status).toBe(401)
            expect(verifyMock).toHaveBeenCalledWith('invalid-token', 'refresh-token-secret')
            expect(decodeMock).toHaveBeenCalledWith('invalid-token')
            expect(refreshTokenRepositoryMock.findById).toHaveBeenCalledWith('user-id')
        })

        it('should throw 401 if clientIp does not match', async () => {
            // Arrange
            refreshTokenRepositoryMock.findById.mockResolvedValueOnce(refreshToken)
            const verifyMock = jest.spyOn(jwt, 'verify').mockReturnValue(undefined)
            const decodeMock = jest.spyOn(jwt, 'decode').mockReturnValue({ sub: 'user-id', roles: ['user'] } as TokenPayload)
            let error

            // Act
            try {
                await authService.refreshToken(refreshToken.token, 'invalid-clientIp')
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).message).toBe(ExceptionStatus.invalidToken)
            expect((error as AppError).status).toBe(401)
            expect(verifyMock).toHaveBeenCalledWith(refreshToken.token, 'refresh-token-secret')
            expect(decodeMock).toHaveBeenCalledWith(refreshToken.token)
            expect(refreshTokenRepositoryMock.findById).toHaveBeenCalledWith('user-id')
        })
    })

    describe('logoutUser', () => {
        it('should logout and delete existing refresh token', async () => {
            // Arrange
            const verifyMock = jest.spyOn(jwt, 'verify').mockReturnValue(undefined)
            const decodeMock = jest.spyOn(jwt, 'decode').mockReturnValue({ sub: 'user-id', roles: ['user'] } as TokenPayload)
            refreshTokenRepositoryMock.findById.mockResolvedValueOnce(refreshToken)

            // Act
            await authService.logoutUser(refreshToken.token, clientIp)

            // Assert
            expect(refreshTokenRepositoryMock.findById).toHaveBeenCalledWith('user-id')
            expect(verifyMock).toHaveBeenCalledWith(refreshToken.token, 'refresh-token-secret')
            expect(decodeMock).toHaveBeenCalledWith(refreshToken.token)
            expect(refreshTokenRepositoryMock.delete).toHaveBeenCalledWith('user-id')
        })

        it('should throw an error if ACCESS_TOKEN_SECRET env is not set', async () => {
            // Arrange
            delete process.env.ACCESS_TOKEN_SECRET
            let error

            // Act
            try {
                await authService.logoutUser(refreshToken.token, clientIp)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).message).toBe(ExceptionStatus.serviceUnavailable)
            expect((error as AppError).status).toBe(503)
            expect(refreshTokenRepositoryMock.findById).not.toBeCalled()
        })

        it('should throw an error if REFRESH_TOKEN_SECRET env is not set', async () => {
            // Arrange
            delete process.env.REFRESH_TOKEN_SECRET
            let error

            // Act
            try {
                await authService.logoutUser(refreshToken.token, clientIp)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).message).toBe(ExceptionStatus.serviceUnavailable)
            expect((error as AppError).status).toBe(503)
            expect(refreshTokenRepositoryMock.findById).not.toBeCalled()
        })

        it('should throw 401 if token is not on database', async () => {
            // Arrange
            const verifyMock = jest.spyOn(jwt, 'verify').mockReturnValue(undefined)
            const decodeMock = jest.spyOn(jwt, 'decode').mockReturnValue({ sub: 'user-id', roles: ['user'] } as TokenPayload)
            let error

            // Act
            try {
                await authService.logoutUser(refreshToken.token, clientIp)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).message).toBe(ExceptionStatus.invalidToken)
            expect((error as AppError).status).toBe(401)
            expect(verifyMock).toHaveBeenCalledWith(refreshToken.token, 'refresh-token-secret')
            expect(decodeMock).toHaveBeenCalledWith(refreshToken.token)
            expect(refreshTokenRepositoryMock.findById).toHaveBeenCalledWith('user-id')
        })

        it('should throw 401 if tokens does not match', async () => {
            // Arrange
            refreshTokenRepositoryMock.findById.mockResolvedValueOnce(refreshToken)
            const verifyMock = jest.spyOn(jwt, 'verify').mockReturnValue(undefined)
            const decodeMock = jest.spyOn(jwt, 'decode').mockReturnValue({ sub: 'user-id', roles: ['user'] } as TokenPayload)
            let error

            // Act
            try {
                await authService.logoutUser('invalid-token', clientIp)
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).message).toBe(ExceptionStatus.invalidToken)
            expect((error as AppError).status).toBe(401)
            expect(verifyMock).toHaveBeenCalledWith('invalid-token', 'refresh-token-secret')
            expect(decodeMock).toHaveBeenCalledWith('invalid-token')
            expect(refreshTokenRepositoryMock.findById).toHaveBeenCalledWith('user-id')
        })

        it('should throw 401 if clientIp does not match', async () => {
            // Arrange
            refreshTokenRepositoryMock.findById.mockResolvedValueOnce(refreshToken)
            const verifyMock = jest.spyOn(jwt, 'verify').mockReturnValue(undefined)
            const decodeMock = jest.spyOn(jwt, 'decode').mockReturnValue({ sub: 'user-id', roles: ['user'] } as TokenPayload)
            let error

            // Act
            try {
                await authService.logoutUser(refreshToken.token, 'invalid-clientIp')
            } catch (e) {
                error = e
            }

            // Assert
            expect(error).toBeInstanceOf(AppError)
            expect((error as AppError).message).toBe(ExceptionStatus.invalidToken)
            expect((error as AppError).status).toBe(401)
            expect(verifyMock).toHaveBeenCalledWith(refreshToken.token, 'refresh-token-secret')
            expect(decodeMock).toHaveBeenCalledWith(refreshToken.token)
            expect(refreshTokenRepositoryMock.findById).toHaveBeenCalledWith('user-id')
        })
    })
})