import { Router } from 'express'
import { celebrate, Segments } from 'celebrate'
import { StandardOptionsJoi } from '@/utils/Joi'
import makeExpressCallback from '@/helpers/expressCallback'
import { MissionController } from '@/controller/MissionController'


const routes = Router()

const MISSION_NAME_REGEX = /^[ a-z\dA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ`'-]+$/
const DESCRIPTION_REGEX = /^[\w.\s]+$/

const getMissionsSchema = StandardOptionsJoi.object().keys({
    name: StandardOptionsJoi.string().regex(MISSION_NAME_REGEX)
})

const addMissionSchema = StandardOptionsJoi.object().keys({
    name: StandardOptionsJoi.string().regex(MISSION_NAME_REGEX).required(),
    description: StandardOptionsJoi.string().regex(DESCRIPTION_REGEX).required(),
    points: StandardOptionsJoi.number().greater(0).required(),
    expirationDate: StandardOptionsJoi.date().min(new Date()).required(),
    createdBy: StandardOptionsJoi.string().uuid().required()
})

routes.get('/mission', celebrate({
    [Segments.QUERY]: getMissionsSchema
}), makeExpressCallback(MissionController.getMissions))

routes.post('/mission', celebrate({
    [Segments.BODY]: addMissionSchema
}), makeExpressCallback(MissionController.addMission))

routes.delete('/mission/:id', celebrate({
    [Segments.PARAMS]: {
        id: StandardOptionsJoi.string().uuid().required()
    }
}), makeExpressCallback(MissionController.deleteMission))

export default routes