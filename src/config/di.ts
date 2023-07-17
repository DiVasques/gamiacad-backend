import { Container } from 'typedi'
import { IAuthRepository } from '@/repository/auth/IAuthRepository'
import { AuthRepository } from '@/repository/auth/AuthRepository'
import { IMissionRepository } from '@/repository/mission/IMissionRepository'
import { MissionRepository } from '@/repository/mission/MissionRepository'
import { IRefreshTokenRepository } from '@/repository/auth/IRefreshTokenRepository'
import { RefreshTokenRepository } from '@/repository/auth/RefreshTokenRepository'
import { IRewardRepository } from '@/repository/reward/IRewardRepository'
import { RewardRepository } from '@/repository/reward/RewardRepository'
import { IUserRepository } from '@/repository/user/IUserRepository'
import { UserRepository } from '@/repository/user/UserRepository'

export const configureContainer = (): void => {
    Container.set<IUserRepository>(ServiceToken.userRepository, new UserRepository())
    Container.set<IMissionRepository>(ServiceToken.missionRepository, new MissionRepository())
    Container.set<IRewardRepository>(ServiceToken.rewardRepository, new RewardRepository())
    Container.set<IAuthRepository>(ServiceToken.authRepository, new AuthRepository())
    Container.set<IRefreshTokenRepository>(ServiceToken.refreshTokenRepository, new RefreshTokenRepository())
}

export const enum ServiceToken {
    userRepository = 'userRepository',
    missionRepository = 'missionRepository',
    rewardRepository = 'rewardRepository',
    authRepository = 'authRepository',
    refreshTokenRepository = 'refreshTokenRepository'
}