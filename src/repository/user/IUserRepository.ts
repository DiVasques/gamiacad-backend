import { User } from "@/models/User"

export interface IUserRepository {
    findById: (id: string) => Promise<(User) | null>,
    findOne: (obj: any) => Promise<(User) | null>,
    find: (obj?: any) => Promise<User[]>

    create: (user: Partial<User>) => Promise<void>
    update(_id: string, data: Partial<User>, options?: Object): Promise<void>;
    delete: (_id: string) => Promise<void>
    findOneAndUpdate: (filter: Partial<User>, item: Partial<User>) => Promise<(User) | null>

}