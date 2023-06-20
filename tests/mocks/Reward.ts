import { Reward } from '@/models/Reward'

export const reward: Reward = {
    _id: '75dd7fd0-347e-4e38-821d-2a49438d15c2',
    name: 'Reward 1',
    number: 1,
    description: 'This is a description',
    price: 150,
    availability: 10,
    claimers: [],
    handed: [],
    createdAt: new Date('2023-06-19T20:24:21.417Z'),
    updatedAt: new Date('2023-06-19T20:24:21.417Z')
}

export const rewardList: Reward[] = [
    reward,
    { ...reward, name: 'Foo', _id: '12345' }
]
