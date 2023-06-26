import { User } from '@/models/User'

export interface IUserRepository {
    findById: (id: string) => Promise<(User) | null>,
    findOne: (obj: any) => Promise<(User) | null>,
    find: (obj?: any) => Promise<User[]>

    create: (user: Partial<User>) => Promise<void>
    update: (_id: string, data: Partial<User>, options?: object) => Promise<void>
    delete: (_id: string) => Promise<void>
    findOneAndUpdate: (filter: Partial<User>, item: Partial<User>) => Promise<(User) | null>

    givePoints: (_id: string, points: number, rollingBack?: boolean) => Promise<void>
    withdrawPoints: (_id: string, points: number) => Promise<number>
}