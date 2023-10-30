import { Router } from 'express'
import { celebrate, Segments } from 'celebrate'
import { StandardOptionsJoi } from '@/utils/Joi'
import makeExpressCallback from '@/helpers/expressCallback'
import { AuthController } from '@/controller/auth/AuthController'


const routes = Router()

const REGISTRATION_REGEX = /^\d{11}$/
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[A-Z])(?=.*\W).{12,}$/

const userAuthSchema = StandardOptionsJoi.object().keys({
    registration: StandardOptionsJoi.string().regex(REGISTRATION_REGEX).required(),
    password: StandardOptionsJoi.string().regex(PASSWORD_REGEX).required()
})

routes.post('/signup', celebrate({
    [Segments.BODY]: userAuthSchema
}), makeExpressCallback(AuthController.registerUser))

routes.post('/login', celebrate({
    [Segments.BODY]: userAuthSchema
}), makeExpressCallback(AuthController.loginUser))

routes.post('/login/admin', celebrate({
    [Segments.BODY]: userAuthSchema
}), makeExpressCallback(AuthController.loginAdmin))

routes.post('/login/refresh', makeExpressCallback(AuthController.refreshToken))

routes.post('/logout', makeExpressCallback(AuthController.logoutUser))

export default routes