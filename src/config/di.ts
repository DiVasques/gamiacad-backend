import { IMissionRepository } from '@/repository/mission/IMissionRepository'
import { MissionRepository } from '@/repository/mission/MissionRepository'
import { IUserRepository } from '@/repository/user/IUserRepository'
import { UserRepository } from '@/repository/user/UserRepository'
import { Container } from 'typedi'

export const configureContainer = (): void => {
    Container.set<IUserRepository>(ServiceToken.userRepository, new UserRepository())
    Container.set<IMissionRepository>(ServiceToken.missionRepository, new MissionRepository())
}

export const enum ServiceToken {
    userRepository = 'userRepository',
    missionRepository = 'missionRepository'
}