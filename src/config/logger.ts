import winston from 'winston'
import expressWinston from 'express-winston'

const loggerFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
)

const baseWhiteList = [
    'headers',
    'method',
    'originalUrl',
    'query',
    'url'
]

const bodyWhiteList = baseWhiteList.concat(['body'])

export const bodyLogger = expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: loggerFormat,
    expressFormat: true,
    colorize: true,
    requestWhitelist:bodyWhiteList,
    responseWhitelist: bodyWhiteList
})

export const logger = expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: loggerFormat,
    expressFormat: true,
    colorize: true,
    requestWhitelist: baseWhiteList,
    responseWhitelist: baseWhiteList
})