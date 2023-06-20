import { Router } from 'express'
import { celebrate, Segments } from 'celebrate'
import { StandardOptionsJoi } from '@/utils/Joi'
import makeExpressCallback from '@/helpers/expressCallback'
import { RewardController } from '@/controller/RewardController'


const routes = Router()

const REWARD_NAME_REGEX = /^[ a-z\dA-ZàèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ`'-]+$/
const DESCRIPTION_REGEX = /^[\w.\s]+$/

const getRewardsSchema = StandardOptionsJoi.object().keys({
    name: StandardOptionsJoi.string().regex(REWARD_NAME_REGEX),
    number: StandardOptionsJoi.number().greater(0)
})

const addRewardSchema = StandardOptionsJoi.object().keys({
    name: StandardOptionsJoi.string().regex(REWARD_NAME_REGEX).required(),
    description: StandardOptionsJoi.string().regex(DESCRIPTION_REGEX).required(),
    price: StandardOptionsJoi.number().greater(0).required(),
    availability: StandardOptionsJoi.number().greater(0).required()
})

routes.get('/reward', celebrate({
    [Segments.QUERY]: getRewardsSchema
}), makeExpressCallback(RewardController.getRewards))

routes.post('/reward', celebrate({
    [Segments.BODY]: addRewardSchema
}), makeExpressCallback(RewardController.addReward))

routes.delete('/reward/:id', celebrate({
    [Segments.PARAMS]: {
        id: StandardOptionsJoi.string().uuid().required()
    }
}), makeExpressCallback(RewardController.deleteReward))

export default routes