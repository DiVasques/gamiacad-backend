import { IAuthRepository } from '@/repository/auth/IAuthRepository'
import { AuthRepository } from '@/repository/auth/AuthRepository'
import { IMissionRepository } from '@/repository/mission/IMissionRepository'
import { MissionRepository } from '@/repository/mission/MissionRepository'
import { IRewardRepository } from '@/repository/reward/IRewardRepository'
import { RewardRepository } from '@/repository/reward/RewardRepository'
import { IUserRepository } from '@/repository/user/IUserRepository'
import { UserRepository } from '@/repository/user/UserRepository'
import { Container } from 'typedi'

export const configureContainer = (): void => {
    Container.set<IUserRepository>(ServiceToken.userRepository, new UserRepository())
    Container.set<IMissionRepository>(ServiceToken.missionRepository, new MissionRepository())
    Container.set<IRewardRepository>(ServiceToken.rewardRepository, new RewardRepository())
    Container.set<IAuthRepository>(ServiceToken.authRepository, new AuthRepository())
}

export const enum ServiceToken {
    userRepository = 'userRepository',
    missionRepository = 'missionRepository',
    rewardRepository = 'rewardRepository',
    authRepository = 'authRepository'
}