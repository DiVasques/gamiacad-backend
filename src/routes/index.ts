import { Request, Response, Router } from 'express'

import UserRoutes from '@/routes/UserRoutes'
import MissionRoutes from '@/routes/MissionRoutes'

const routes = Router()

routes.get('/', (_: Request, res: Response) => {
    res.send({ status: 'Server up and running' })
})

routes.use(UserRoutes)
routes.use(MissionRoutes)

export default routes