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

const editRewardSchema = StandardOptionsJoi.object().keys({
    name: StandardOptionsJoi.string().regex(REWARD_NAME_REGEX),
    description: StandardOptionsJoi.string().regex(DESCRIPTION_REGEX)
})

routes.get('/', Auth.authorizeAdminOnly, celebrate({
    [Segments.QUERY]: getRewardsSchema
}), makeExpressCallback(RewardController.getRewards))

routes.post('/', Auth.authorizeAdminOnly, celebrate({
    [Segments.BODY]: addRewardSchema
}), makeExpressCallback(RewardController.addReward))

routes.patch('/:id', Auth.authorizeAdminOnly, celebrate({
    [Segments.PARAMS]: {
        id: StandardOptionsJoi.string().uuid().required()
    },
    [Segments.BODY]: editRewardSchema
}), makeExpressCallback(RewardController.editReward))

routes.delete('/:id', Auth.authorizeAdminOnly, celebrate({
    [Segments.PARAMS]: {
        id: StandardOptionsJoi.string().uuid().required()
    }
}), makeExpressCallback(RewardController.deactivateReward))

routes.put('/:id/:userId', Auth.authorizeUser, celebrate({
    [Segments.PARAMS]: {
        id: StandardOptionsJoi.string().uuid().required(),
        userId: StandardOptionsJoi.string().uuid().required()
    }
}), makeExpressCallback(RewardController.claimReward))

routes.patch('/:id/:userId', Auth.authorizeAdminOnly, celebrate({
    [Segments.PARAMS]: {
        id: StandardOptionsJoi.string().uuid().required(),
        userId: StandardOptionsJoi.string().uuid().required()
    }
}), makeExpressCallback(RewardController.handReward))

routes.delete('/:id/:userId', Auth.authorizeUser, celebrate({
    [Segments.PARAMS]: {
        id: StandardOptionsJoi.string().uuid().required(),
        userId: StandardOptionsJoi.string().uuid().required()
    }
}), makeExpressCallback(RewardController.cancelClaim))

export default routes