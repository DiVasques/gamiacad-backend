import { Router } from 'express'
import { celebrate, Segments } from 'celebrate'
import { StandardOptionsJoi } from '@/utils/Joi'
import makeExpressCallback from '@/helpers/expressCallback'
import { Auth } from '@/middlewares/Auth'
import { SecureAuthController } from '@/controller/auth/SecureAuthController'

const routes = Router()

routes.patch('/admin/:id', Auth.authorizeAdminOnly, celebrate({
    [Segments.PARAMS]: {
        id: StandardOptionsJoi.string().uuid().required()
    },
    [Segments.BODY]: {
        admin: StandardOptionsJoi.boolean().required()
    }
}), makeExpressCallback(SecureAuthController.updateAdminPrivileges))

export default routes