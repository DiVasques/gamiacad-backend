import { Request, Response, NextFunction } from 'express'
import { CelebrateError, isCelebrateError } from 'celebrate'
import ExceptionStatus from '@/utils/enum/ExceptionStatus'

import AppError from '@/models/error/AppError'

const Exception = (err: AppError | CelebrateError | Error | any, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) return response.status(err.status).json(err)

  if (isCelebrateError(err)) return response.status(400).json(
    process.env.DEBUG ?
      { message: err.message, details: Object.fromEntries(err.details ?? new Map()) } :
      undefined
  )

  if (err instanceof Error) {
    return response.status(500).send({
      message: (process.env.DEBUG ? err.message : ExceptionStatus.internalError),
      stack: (process.env.DEBUG ? err.stack : undefined)
    })
  }

  return response.status(500).send({ status: 500, message: ExceptionStatus.unexpectedError })
}

export { Exception }
