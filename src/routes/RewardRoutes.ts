import { Router } from 'express'
import { celebrate, Segments } from 'celebrate'
import { StandardOptionsJoi } from '@/utils/Joi'
import makeExpressCallback from '@/helpers/expressCallback'
import { RewardController } from '@/controller/RewardController'
import { Auth } from '@/middlewares/Auth'


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

routes.get('/', celebrate({
    [Segments.QUERY]: getRewardsSchema
}), Auth.authorizeAdminOnly, makeExpressCallback(RewardController.getRewards))

routes.post('/', celebrate({
    [Segments.BODY]: addRewardSchema
}), Auth.authorizeAdminOnly, makeExpressCallback(RewardController.addReward))

routes.delete('/:id', celebrate({
    [Segments.PARAMS]: {
        id: StandardOptionsJoi.string().uuid().required()
    }
}), Auth.authorizeAdminOnly, makeExpressCallback(RewardController.deactivateReward))

routes.put('/:id/:userId', celebrate({
    [Segments.PARAMS]: {
        id: StandardOptionsJoi.string().uuid().required(),
        userId: StandardOptionsJoi.string().uuid().required()
    }
}), Auth.authorizeUser, makeExpressCallback(RewardController.claimReward))

routes.patch('/:id/:userId', celebrate({
    [Segments.PARAMS]: {
        id: StandardOptionsJoi.string().uuid().required(),
        userId: StandardOptionsJoi.string().uuid().required()
    }
}), Auth.authorizeAdminOnly, makeExpressCallback(RewardController.handReward))

routes.delete('/:id/:userId', celebrate({
    [Segments.PARAMS]: {
        id: StandardOptionsJoi.string().uuid().required(),
        userId: StandardOptionsJoi.string().uuid().required()
    }
}), Auth.authorizeUser, makeExpressCallback(RewardController.cancelClaim))

export default routes