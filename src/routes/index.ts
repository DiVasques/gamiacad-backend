import { Request, Response, Router } from 'express'

import UserRoutes from '@/routes/UserRoutes'

const routes = Router()

routes.get('/', (_: Request, res: Response) => {
    res.send({ status: 'Server up and running' })
})

routes.use(UserRoutes)

export default routes