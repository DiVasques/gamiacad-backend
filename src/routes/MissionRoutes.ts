import { Router } from 'express'
import { celebrate, Segments } from 'celebrate'
import { StandardOptionsJoi } from '@/utils/Joi'
import makeExpressCallback from '@/helpers/expressCallback'
import { MissionController } from '@/controller/MissionController'
import { Auth } from '@/middlewares/Auth'


const routes = Router()

const MISSION_NAME_REGEX = /^[ \p{L}\p{N}`'-]+$/u
const DESCRIPTION_REGEX = /^[\p{L}\p{N}\s.,?!$-]+$/u

const getMissionsSchema = StandardOptionsJoi.object().keys({
    name: StandardOptionsJoi.string().regex(MISSION_NAME_REGEX),
    number: StandardOptionsJoi.number().greater(0),
    createdBy: StandardOptionsJoi.string().uuid()
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

routes.get('/', Auth.authorizeAdminOnly, celebrate({
    [Segments.QUERY]: getMissionsSchema
}), makeExpressCallback(MissionController.getMissions))

routes.get('/:id', Auth.authorizeAdminOnly, celebrate({
    [Segments.PARAMS]: {
        id: StandardOptionsJoi.string().uuid().required()
    }
}), makeExpressCallback(MissionController.getMission))

routes.post('/', Auth.authorizeAdminOnly, celebrate({
    [Segments.BODY]: addMissionSchema
}), makeExpressCallback(MissionController.addMission))

routes.patch('/:id', Auth.authorizeAdminOnly, celebrate({
    [Segments.PARAMS]: {
        id: StandardOptionsJoi.string().uuid().required()
    },
    [Segments.BODY]: editMissionSchema
}), makeExpressCallback(MissionController.editMission))

routes.patch('/:id/:userId', Auth.authorizeAdminOnly, celebrate({
    [Segments.PARAMS]: {
        id: StandardOptionsJoi.string().uuid().required(),
        userId: StandardOptionsJoi.string().uuid().required()
    }
}), makeExpressCallback(MissionController.completeMission))

routes.delete('/:id', Auth.authorizeAdminOnly, celebrate({
    [Segments.PARAMS]: {
        id: StandardOptionsJoi.string().uuid().required()
    }
}), makeExpressCallback(MissionController.deactivateMission))

routes.put('/:id/:userId', Auth.authorizeUser, celebrate({
    [Segments.PARAMS]: {
        id: StandardOptionsJoi.string().uuid().required(),
        userId: StandardOptionsJoi.string().uuid().required()
    }
}), makeExpressCallback(MissionController.subscribeUser))

export default routes