import { Router } from 'express'
import { celebrate, Segments } from 'celebrate'
import { StandardOptionsJoi } from '@/utils/Joi'
import makeExpressCallback from '@/helpers/expressCallback'
import { UserController } from '@/controller/UserController'
import { Auth } from '@/middlewares/Auth'


const routes = Router()

const USER_NAME_REGEX = /^[ a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'`-]+$/
const USER_REGISTRATION_REGEX = /^\d{11}$/

const getUsersSchema = StandardOptionsJoi.object().keys({
    name: StandardOptionsJoi.string().regex(USER_NAME_REGEX)
})

const addUserSchema = StandardOptionsJoi.object().keys({
    name: StandardOptionsJoi.string().regex(USER_NAME_REGEX).required(),
    registration: StandardOptionsJoi.string().regex(USER_REGISTRATION_REGEX).required(),
    email: StandardOptionsJoi.string().email().required(),
})

routes.get('/', celebrate({
    [Segments.QUERY]: getUsersSchema
}), Auth.authorizeAdminOnly, makeExpressCallback(UserController.getUsers))

routes.get('/:id', celebrate({
    [Segments.PARAMS]: {
        id: StandardOptionsJoi.string().uuid().required()
    }
}), Auth.authorizeUser, makeExpressCallback(UserController.getUserById))

routes.get('/:id/mission', celebrate({
    [Segments.PARAMS]: {
        id: StandardOptionsJoi.string().uuid().required()
    }
}), Auth.authorizeUser, makeExpressCallback(UserController.getUserMissions))

routes.get('/:id/reward', celebrate({
    [Segments.PARAMS]: {
        id: StandardOptionsJoi.string().uuid().required()
    }
}), Auth.authorizeUser, makeExpressCallback(UserController.getUserRewards))

routes.post('/:id', celebrate({
    [Segments.BODY]: addUserSchema
}), Auth.authorizeUser, makeExpressCallback(UserController.addUser))

routes.delete('/:id', celebrate({
    [Segments.PARAMS]: {
        id: StandardOptionsJoi.string().uuid().required()
    }
}), Auth.authorizeUser, makeExpressCallback(UserController.deleteUser))

export default routes