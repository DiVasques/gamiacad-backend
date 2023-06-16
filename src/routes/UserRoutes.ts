import { Router } from "express"
import { celebrate, Segments } from 'celebrate'
import { StandardOptionsJoi } from "@/utils/Joi"
import makeExpressCallback from "@/helpers/expressCallback"
import { UserController } from "@/controller/UserController"


const routes = Router()

const getUsersSchema = StandardOptionsJoi.object().keys({
    name: StandardOptionsJoi.string().regex(/^[ a-zA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ'`'\-]+$/)
})

routes.get('/user', celebrate({
    [Segments.QUERY]: getUsersSchema
}), makeExpressCallback(UserController.getUsers))

export default routes