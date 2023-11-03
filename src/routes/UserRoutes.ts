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

routes.get('/', Auth.authorizeAdminOnly, celebrate({
    [Segments.QUERY]: getUsersSchema
}), makeExpressCallback(UserController.getUsers))

routes.get('/:id', Auth.authorizeUser, celebrate({
    [Segments.PARAMS]: {
        id: StandardOptionsJoi.string().uuid().required()
    }
}), makeExpressCallback(UserController.getUserById))

routes.get('/:id/mission', Auth.authorizeUser, celebrate({
    [Segments.PARAMS]: {
        id: StandardOptionsJoi.string().uuid().required()
    }
}), makeExpressCallback(UserController.getUserMissions))

routes.get('/:id/reward', Auth.authorizeUser, celebrate({
    [Segments.PARAMS]: {
        id: StandardOptionsJoi.string().uuid().required()
    }
}), makeExpressCallback(UserController.getUserRewards))

routes.post('/:id', Auth.authorizeUser, celebrate({
    [Segments.BODY]: addUserSchema
}), makeExpressCallback(UserController.addUser))

routes.delete('/:id', Auth.authorizeUser, celebrate({
    [Segments.PARAMS]: {
        id: StandardOptionsJoi.string().uuid().required()
    }
}), makeExpressCallback(UserController.deleteUser))

export default routes