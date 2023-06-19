import { User } from '@/models/User'

export const user: User = {
    _id: '1234',
    name: 'Diogo',
    email: 'email@email.com',
    balance: 0,
    totalPoints: 0,
    activeMissions: [],
    pendingRewards: [],
    completedMissions: [],
    claimedRewards: [],
    createdAt: new Date('2023-06-19T02:52:14.474Z'),
    updatedAt: new Date('2023-06-19T02:52:14.474Z')
}

export const userList: User[] = [
    user,
    { ...user, name: 'Foo', _id: '12345' }
]
