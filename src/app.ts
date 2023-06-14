import express, { Express, Request, Response } from 'express'
import cors from "cors"
import dotenv from "dotenv"
import routes from '@/routes'

dotenv.config()

const app: Express = express()
app.use(express.json())
app.use(cors())

app.use('/api', routes)

export default app