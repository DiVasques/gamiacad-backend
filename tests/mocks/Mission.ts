import { Mission } from '@/models/Mission'
import { UserMission } from '@/models/UserMission'

export const mission: Mission = {
    _id: '75dd7fd0-347e-4e38-821d-2a49438d15c2',
    name: 'Mission 1',
    number: 1,
    createdBy: '1b6ec50e-9be1-459f-bd69-11bfa325d03b',
    description: 'This is a description',
    points: 150,
    expirationDate: new Date('2043-06-25T20:20:14.000Z'),
    participants: [],
    completers: [],
    createdAt: new Date('2043-06-19T20:24:21.417Z'),
    updatedAt: new Date('2043-06-19T20:24:21.417Z')
}

export const missionList: Mission[] = [
    mission,
    { ...mission, name: 'Foo', _id: '12345' }
]

export const userMission: UserMission = {
    _id: '75dd7fd0-347e-4e38-821d-2a49438d15c2',
    name: 'Mission 1',
    number: 1,
    createdBy: '1b6ec50e-9be1-459f-bd69-11bfa325d03b',
    description: 'This is a description',
    points: 150,
    expirationDate: new Date('2043-06-25T20:20:14.000Z'),
    createdAt: new Date('2043-06-19T20:24:21.417Z'),
    updatedAt: new Date('2043-06-19T20:24:21.417Z')
}

export const userMissions = {
    active: [userMission],
    completed: [userMission]
}