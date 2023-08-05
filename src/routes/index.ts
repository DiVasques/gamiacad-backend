import { Router } from 'express'

import UserRoutes from '@/routes/UserRoutes'
import MissionRoutes from '@/routes/MissionRoutes'
import RewardRoutes from '@/routes/RewardRoutes'

const routes = Router()

routes.use('/user', UserRoutes)
routes.use('/mission', MissionRoutes)
routes.use('/reward', RewardRoutes)

export default routes