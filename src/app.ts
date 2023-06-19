import express, { Express } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import routes from '@/routes'
import winston from 'winston'
import expressWinston from 'express-winston'
import 'reflect-metadata';
import { Exception } from '@/middlewares/Exception'
import { configureContainer } from '@/config/di'

dotenv.config()

configureContainer();

const app: Express = express()
app.use(express.json())
app.use(cors())

expressWinston.requestWhitelist.push('body');
expressWinston.responseWhitelist.push('body');

app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    ),
    expressFormat: true,
    colorize: true
}))

app.use('/api', routes)

app.use(Exception)

export default app