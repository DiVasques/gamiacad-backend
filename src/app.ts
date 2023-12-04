import express, { Express } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { expand } from 'dotenv-expand'
import routes from '@/routes'
import authRoutes from '@/routes/auth/AuthRoutes'
import secureAuthRoutes from '@/routes/auth/SecureAuthRoutes'
import 'reflect-metadata'
import { Exception } from '@/middlewares/Exception'
import { Auth } from '@/middlewares/Auth'
import { configureContainer } from '@/config/di'
import { bodyLogger, logger } from '@/config/logger'

const env = dotenv.config()
expand(env)

configureContainer()

const app: Express = express()
app.use(express.json())
app.use(cors())



app.use(Auth.validateClient)
app.get('/api', (_, res) => {
  res.send('GamiAcad API is up and running');
});
app.use('/api', logger, authRoutes)
app.use('/api', bodyLogger, Auth.authenticate, routes)
app.use('/api', bodyLogger, Auth.authenticate, secureAuthRoutes)

app.use(Exception)

export default app