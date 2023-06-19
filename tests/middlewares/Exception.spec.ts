import { Request, Response, NextFunction } from 'express'
import AppError from '@/models/error/AppError'
import ExceptionStatus from '@/utils/enum/ExceptionStatus'
import { Exception } from '@/middlewares/Exception'
import { CelebrateError, isCelebrateError } from 'celebrate'

jest.mock('celebrate', () => (
    {
        CelebrateError: jest.fn(),
        isCelebrateError: jest.fn()
    }
))

describe('Exception', () => {
    let request: Request
    let response: Response
    let next: NextFunction

    beforeEach(() => {
        process.env.DEBUG = 'true'
        request = {} as Request
        response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        } as unknown as Response
        next = jest.fn() as NextFunction
        (isCelebrateError as unknown as jest.Mock).mockImplementation(() => false)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should handle AppError and return the corresponding response and status code', () => {
        // Arrange
        const appError = new AppError(ExceptionStatus.notFound, 404)

        // Act
        Exception(appError, request, response, next)

        // Assert
        expect(response.status).toHaveBeenCalledWith(appError.status)
        expect(response.json).toHaveBeenCalledWith(appError)
        expect(next).not.toHaveBeenCalled()
    })

    it('should handle celebrate errors and return the details with status code 400', () => {
        // Arrange
        (isCelebrateError as unknown as jest.Mock).mockImplementation(() => true)

        const celebrateError = new CelebrateError()

        // Act
        Exception(celebrateError, request, response, next)

        // Assert
        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith({
            message: celebrateError.message,
            details: Object.fromEntries(new Map()),
        })
        expect(next).not.toHaveBeenCalled()
    })

    it('should handle celebrate errors and not return the details', () => {
        // Arrange
        (isCelebrateError as unknown as jest.Mock).mockImplementation(() => true)
        delete process.env.DEBUG

        const celebrateError = new CelebrateError()

        // Act
        Exception(celebrateError, request, response, next)

        // Assert
        expect(response.status).toHaveBeenCalledWith(400)
        expect(response.json).toHaveBeenCalledWith(undefined)
        expect(next).not.toHaveBeenCalled()
    })

    it('should handle other errors and return the corresponding response', () => {
        // Arrange
        let error = new Error('Test Error')

        // Act
        Exception(error, request, response, next)

        // Assert
        expect(response.status).toHaveBeenCalledWith(500)
        expect(response.send).toHaveBeenCalledWith({
            message: error.message,
            stack: error.stack,
        })
        expect(next).not.toHaveBeenCalled()
    })

    it('should handle other errors and return generic response without stack', () => {
        // Arrange
        let error = new Error('Test Error')
        delete process.env.DEBUG

        // Act
        Exception(error, request, response, next)

        // Assert
        expect(response.status).toHaveBeenCalledWith(500)
        expect(response.send).toHaveBeenCalledWith({
            message: ExceptionStatus.internalError,
            stack: undefined,
        })
        expect(next).not.toHaveBeenCalled()
    })

    it('should handle unexpected errors and return the corresponding response', () => {
        // Arrange
        let error = null

        // Act
        Exception(error, request, response, next)

        // Assert
        expect(response.status).toHaveBeenCalledWith(500)
        expect(response.send).toHaveBeenCalledWith({
            status: 500,
            message: ExceptionStatus.unexpectedError,
        })
        expect(next).not.toHaveBeenCalled()
    })
})
