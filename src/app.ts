import express, { Express } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import routes from '@/routes'
import authRoutes from '@/routes/auth/AuthRoutes'
import secureAuthRoutes from '@/routes/auth/SecureAuthRoutes'
import 'reflect-metadata'
import { Exception } from '@/middlewares/Exception'
import { Auth } from '@/middlewares/Auth'
import { configureContainer } from '@/config/di'
import { bodyLogger, logger } from '@/config/logger'

dotenv.config()

configureContainer()

const app: Express = express()
app.use(express.json())
app.use(cors())



app.use(Auth.validateClient)
app.use('/api', logger, authRoutes)
app.use('/api', bodyLogger, Auth.authenticate, routes)
app.use('/api', bodyLogger, Auth.authenticate, secureAuthRoutes)

app.use(Exception)

export default app