import { Router } from 'express'

import UserRoutes from '@/routes/UserRoutes'
import MissionRoutes from '@/routes/MissionRoutes'
import RewardRoutes from '@/routes/RewardRoutes'

const routes = Router()

routes.use(UserRoutes)
routes.use(MissionRoutes)
routes.use(RewardRoutes)

export default routes