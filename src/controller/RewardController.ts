import { RewardService } from '@/services/RewardService'
import HttpRequest from '@/ports/http/HttpRequest'
import HttpResponse from '@/ports/http/HttpResponse'
import { Container } from 'typedi'

export class RewardController {
    static async getRewards(request: HttpRequest): Promise<HttpResponse> {
        const rewardService = Container.get(RewardService)
        const rewards = await rewardService.getRewards(request.query)
        return new HttpResponse(200, { rewards })
    }

    static async getClaimedRewards(_: HttpRequest): Promise<HttpResponse> {
        const rewardService = Container.get(RewardService)
        const rewards = await rewardService.getClaimedRewards()
        return new HttpResponse(200, { rewards })
    }

    static async addReward(request: HttpRequest): Promise<HttpResponse> {
        const rewardService = Container.get(RewardService)
        await rewardService.addReward(request.body)
        return new HttpResponse(201)
    }

    static async editReward(request: HttpRequest): Promise<HttpResponse> {
        const rewardService = Container.get(RewardService)
        await rewardService.editReward(request.params.id, request.body)
        return new HttpResponse(204)
    }

    static async deactivateReward(request: HttpRequest): Promise<HttpResponse> {
        const rewardService = Container.get(RewardService)
        await rewardService.deactivateReward(request.params.id)
        return new HttpResponse(204)
    }

    static async claimReward(request: HttpRequest): Promise<HttpResponse> {
        const rewardService = Container.get(RewardService)
        const { id, userId } = request.params
        await rewardService.claimReward(id, userId)
        return new HttpResponse(204)
    }

    static async handReward(request: HttpRequest): Promise<HttpResponse> {
        const rewardService = Container.get(RewardService)
        const { id, userId } = request.params
        await rewardService.handReward(id, userId)
        return new HttpResponse(204)
    }

    static async cancelClaim(request: HttpRequest): Promise<HttpResponse> {
        const rewardService = Container.get(RewardService)
        const { id, userId } = request.params
        await rewardService.cancelClaim(id, userId)
        return new HttpResponse(204)
    }
}