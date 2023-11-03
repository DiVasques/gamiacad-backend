import { Router } from 'express'
import { celebrate, Segments } from 'celebrate'
import { StandardOptionsJoi } from '@/utils/Joi'
import makeExpressCallback from '@/helpers/expressCallback'
import { MissionController } from '@/controller/MissionController'
import { Auth } from '@/middlewares/Auth'


const routes = Router()

const MISSION_NAME_REGEX = /^[ a-z\dA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ`'-]+$/
const DESCRIPTION_REGEX = /^[\w\s,.]+$/

const getMissionsSchema = StandardOptionsJoi.object().keys({
    name: StandardOptionsJoi.string().regex(MISSION_NAME_REGEX),
    number: StandardOptionsJoi.number().greater(0)
})

const addMissionSchema = StandardOptionsJoi.object().keys({
    name: StandardOptionsJoi.string().regex(MISSION_NAME_REGEX).required(),
    description: StandardOptionsJoi.string().regex(DESCRIPTION_REGEX).required(),
    points: StandardOptionsJoi.number().greater(0).required(),
    expirationDate: StandardOptionsJoi.date().min(new Date()).required()
})

const editMissionSchema = StandardOptionsJoi.object().keys({
    name: StandardOptionsJoi.string().regex(MISSION_NAME_REGEX),
    description: StandardOptionsJoi.string().regex(DESCRIPTION_REGEX),
    expirationDate: StandardOptionsJoi.date().min(new Date())
})

routes.get('/', celebrate({
    [Segments.QUERY]: getMissionsSchema
}), Auth.authorizeAdminOnly, makeExpressCallback(MissionController.getMissions))

routes.post('/', celebrate({
    [Segments.BODY]: addMissionSchema
}), Auth.authorizeAdminOnly, makeExpressCallback(MissionController.addMission))

routes.get('/:id', celebrate({
    [Segments.PARAMS]: {
        id: StandardOptionsJoi.string().uuid().required()
    }
}), Auth.authorizeAdminOnly, makeExpressCallback(MissionController.getMission))

routes.patch('/:id', celebrate({
    [Segments.PARAMS]: {
        id: StandardOptionsJoi.string().uuid().required()
    },
    [Segments.BODY]: editMissionSchema
}), Auth.authorizeAdminOnly, makeExpressCallback(MissionController.editMission))

routes.delete('/:id', celebrate({
    [Segments.PARAMS]: {
        id: StandardOptionsJoi.string().uuid().required()
    }
}), Auth.authorizeAdminOnly, makeExpressCallback(MissionController.deactivateMission))

routes.put('/:id/:userId', celebrate({
    [Segments.PARAMS]: {
        id: StandardOptionsJoi.string().uuid().required(),
        userId: StandardOptionsJoi.string().uuid().required()
    }
}), Auth.authorizeUser, makeExpressCallback(MissionController.subscribeUser))

routes.patch('/:id/:userId', celebrate({
    [Segments.PARAMS]: {
        id: StandardOptionsJoi.string().uuid().required(),
        userId: StandardOptionsJoi.string().uuid().required()
    }
}), Auth.authorizeAdminOnly, makeExpressCallback(MissionController.completeMission))

export default routes