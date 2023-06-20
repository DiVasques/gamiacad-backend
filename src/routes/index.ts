import { Router } from 'express'

import UserRoutes from '@/routes/UserRoutes'
import MissionRoutes from '@/routes/MissionRoutes'

const routes = Router()

routes.use(UserRoutes)
routes.use(MissionRoutes)

export default routes