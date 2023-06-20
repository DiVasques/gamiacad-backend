import { RewardService } from '@/services/RewardService'
import HttpRequest from '@/models/http/HttpRequest'
import HttpResponse from '@/models/http/HttpResponse'
import { Container } from 'typedi'

export class RewardController {
    static async getRewards(request: HttpRequest): Promise<HttpResponse> {
        const rewardService = Container.get(RewardService)
        const rewards = await rewardService.getRewards(request.query)
        return new HttpResponse(200, { rewards })
    }

    static async addReward(request: HttpRequest): Promise<HttpResponse> {
        const rewardService = Container.get(RewardService)
        await rewardService.addReward(request.body)
        return new HttpResponse(201)
    }

    static async deleteReward(request: HttpRequest): Promise<HttpResponse> {
        const rewardService = Container.get(RewardService)
        await rewardService.deleteReward(request.params.id)
        return new HttpResponse(204)
    }
}