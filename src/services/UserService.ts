import { User } from '@/models/User'
import { ServiceToken } from '@/config/di'
import { IUserRepository } from '@/repository/user/IUserRepository'
import { Inject, Service } from 'typedi'
import AppError from '@/models/error/AppError'
import ExceptionStatus from '@/utils/enum/ExceptionStatus'

@Service()
export class UserService {
    @Inject(ServiceToken.userRepository)
    private userRepository: IUserRepository

    async getUsers(filter: Partial<User>): Promise<User[]> {
        return await this.userRepository.find(filter)
    }

    async getUserById(id: string): Promise<User> {
        let user = await this.userRepository.findById(id)
        if (!user) {
            throw new AppError(ExceptionStatus.notFound, 404)
        }
        return user
    }

    async addUser(user: Partial<User>) {
        await this.userRepository.create(user)
    }
}