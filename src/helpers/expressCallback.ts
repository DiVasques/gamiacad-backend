import HttpRequest from '@/ports/http/HttpRequest'
import HttpResponse from '@/ports/http/HttpResponse'
import { Request, Response, NextFunction } from 'express'

export default function makeExpressCallback(controller: (request: HttpRequest) => Promise<HttpResponse>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest = {
      body: req.body,
      query: req.query,
      params: req.params,
      ip: req.ip,
      method: req.method,
      path: req.path,
      headers: {
        'Content-Type': req.get('Content-Type'),
        Referer: req.get('referer'),
        'User-Agent': req.get('User-Agent'),
        userId: req.headers['userId'] as string
      }
    }
    controller(httpRequest)
      .then(httpResponse => {
        if (httpResponse.headers) {
          res.set(httpResponse.headers)
        }
        res.type('json')
        res.status(httpResponse.statusCode).send(httpResponse.body)
      })
      .catch(error => next(error))
  }

}
