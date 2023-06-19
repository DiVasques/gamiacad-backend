import { Router } from 'express'
import { celebrate, Segments } from 'celebrate'
import { StandardOptionsJoi } from '@/utils/Joi'
import makeExpressCallback from '@/helpers/expressCallback'
import { UserController } from '@/controller/UserController'


const routes = Router()

const USER_NAME_REGEX = /^[ a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'`'\-]+$/

const getUsersSchema = StandardOptionsJoi.object().keys({
    name: StandardOptionsJoi.string().regex(USER_NAME_REGEX)
})

const addUserSchema = StandardOptionsJoi.object().keys({
    name: StandardOptionsJoi.string().regex(USER_NAME_REGEX).required(),
    email: StandardOptionsJoi.string().email().required()
})

routes.get('/user', celebrate({
    [Segments.QUERY]: getUsersSchema
}), makeExpressCallback(UserController.getUsers))

routes.get('/user/:id', celebrate({
    [Segments.PARAMS]: {
        id: StandardOptionsJoi.string().uuid().required()
    }
}), makeExpressCallback(UserController.getUserById))

routes.post('/user', celebrate({
    [Segments.BODY]: addUserSchema
}), makeExpressCallback(UserController.addUser))

export default routes