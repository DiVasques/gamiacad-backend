import { User } from '@/models/User'
import { UserWithPrivilege } from '@/models/UserWithPrivilege'

export const user: User = {
    _id: '1b6ec50e-9be1-459f-bd69-11bfa325d03b',
    name: 'Diogo',
    email: 'email@email.com',
    registration: '12345678901',
    balance: 15000,
    totalPoints: 15000,
    createdAt: new Date('2043-06-19T02:52:14.474Z'),
    updatedAt: new Date('2043-06-19T02:52:14.474Z')
}

export const userWithPrivilege: UserWithPrivilege = {
    ...user,
    admin: true
}

export const userList: User[] = [
    user,
    { ...user, name: 'Foo', _id: '12345' }
]

export const userWithPrivilegeList: UserWithPrivilege[] = [
    userWithPrivilege,
    { ...userWithPrivilege, name: 'Foo', _id: '12345' }
]
