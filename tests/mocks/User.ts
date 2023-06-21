import { User } from '@/models/User'

export const user: User = {
    _id: '1234',
    name: 'Diogo',
    email: 'email@email.com',
    balance: 15000,
    totalPoints: 15000,
    createdAt: new Date('2043-06-19T02:52:14.474Z'),
    updatedAt: new Date('2043-06-19T02:52:14.474Z')
}

export const userList: User[] = [
    user,
    { ...user, name: 'Foo', _id: '12345' }
]
