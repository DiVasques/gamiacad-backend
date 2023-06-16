import { User } from "@/models/User";
import { ServiceToken } from "@/config/di";
import { IUserRepository } from "@/repository/user/IUserRepository";
import { Inject, Service } from "typedi";

@Service()
export class UserService {
    @Inject(ServiceToken.userRepository)
    private userRepository: IUserRepository;

    async getUsers(filter: Partial<User>): Promise<User[]> {
        return await this.userRepository.find(filter)
    }
}