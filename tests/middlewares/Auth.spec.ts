import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { Auth } from '@/middlewares/Auth'
import AppError from '@/models/error/AppError'
import { TokenPayload } from '@/models/auth/TokenPayload'

describe('Auth', () => {
    let req: Partial<Request>
    let res: Partial<Response>
    let next: NextFunction

    beforeEach(() => {
        req = {}
        res = {}
        next = jest.fn()
        process.env.CLIENT_ID = 'your-client-id'
        process.env.ACCESS_TOKEN_SECRET = 'your-token-secret'
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('validateClient', () => {
        it('should call next if clientid is valid', () => {
            // Arrange
            req.headers = { clientid: 'your-client-id' }

            // Act
            Auth.validateClient(req as Request, res as Response, next)

            // Assert
            expect(next).toHaveBeenCalled()
        })

        it('should throw an error if CLIENT_ID is not set', () => {
            // Arrange
            delete process.env.CLIENT_ID

            // Act and Assert
            expect(() => Auth.validateClient(req as Request, res as Response, next)).toThrow(AppError)
            expect(next).not.toHaveBeenCalled()
        })

        it('should throw an error if clientid is missing', () => {
            // Arrange
            req.headers = {}

            // Act and Assert
            expect(() => Auth.validateClient(req as Request, res as Response, next)).toThrow(AppError)
            expect(next).not.toHaveBeenCalled()
        })

        it('should throw an error if clientid is invalid', () => {
            // Arrange
            req.headers = { clientid: 'invalid-client-id' }

            // Act and Assert
            expect(() => Auth.validateClient(req as Request, res as Response, next)).toThrow(AppError)
            expect(next).not.toHaveBeenCalled()
        })
    })

    describe('authenticate', () => {
        const token = 'valid-token'

        it('should call next and set userId and roles in headers if token is valid', () => {
            // Arrange
            req.headers = { authorization: `Bearer ${token}` }

            const verifyMock = jest.spyOn(jwt, 'verify').mockReturnValue(undefined)
            const decodeMock = jest.spyOn(jwt, 'decode').mockReturnValue({ sub: 'user-id', roles: ['user'] } as TokenPayload)

            // Act
            Auth.authenticate(req as Request, res as Response, next)

            // Assert
            expect(verifyMock).toHaveBeenCalledWith(token, 'your-token-secret')
            expect(decodeMock).toHaveBeenCalledWith(token)
            expect(req.headers?.userId).toBe('user-id')
            expect(req.headers?.roles).toEqual(['user'])
            expect(next).toHaveBeenCalled()
        })

        it('should throw an error if ACCESS_TOKEN_SECRET is not set', () => {
            // Arrange
            delete process.env.ACCESS_TOKEN_SECRET

            // Act and Assert
            expect(() => Auth.authenticate(req as Request, res as Response, next)).toThrow(AppError)
            expect(next).not.toHaveBeenCalled()
        })

        it('should throw an error if authorization header is missing', () => {
            // Arrange
            req.headers = {}

            // Act and Assert
            expect(() => Auth.authenticate(req as Request, res as Response, next)).toThrow(AppError)
            expect(next).not.toHaveBeenCalled()
        })

        it('should throw an error if authorization header does not start with Bearer', () => {
            // Arrange
            req.headers = { authorization: 'invalid-token' }

            // Act and Assert
            expect(() => Auth.authenticate(req as Request, res as Response, next)).toThrow(AppError)
            expect(next).not.toHaveBeenCalled()
        })

        it('should throw an error if token is invalid', () => {
            // Arrange
            req.headers = { authorization: 'Bearer invalid-token' }

            jest.spyOn(jwt, 'verify').mockImplementation(() => {
                throw new Error()
            })

            // Act and Assert
            expect(() => Auth.authenticate(req as Request, res as Response, next)).toThrow(AppError)
            expect(next).not.toHaveBeenCalled()
        })
    })
})
