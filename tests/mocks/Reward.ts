import { Reward } from '@/models/Reward'
import { RewardWithUsers } from '@/models/RewardWithUsers'
import { EditReward } from '@/ports/reward/EditReward'

export const reward: Reward = {
    _id: '75dd7fd0-347e-4e38-821d-2a49438d15c2',
    name: 'Reward 1',
    number: 1,
    description: 'This is a description',
    price: 150,
    availability: 10,
    claimers: [
        {
            id: 'c4ee73c6-2d09-4397-a345-549396286083',
            date: new Date('2043-06-19T20:24:21.417Z')
        },
    ],
    handed: [],
    createdAt: new Date('2043-06-19T20:24:21.417Z'),
    updatedAt: new Date('2043-06-19T20:24:21.417Z'),
    active: true
}

export const rewardWithUsers: RewardWithUsers = {
    ...reward,
    claimersInfo: [],
    handedInfo: []
}

export const editReward: EditReward = {
    name: 'Reward 1',
    description: 'This is a description'
}

export const rewardList: Reward[] = [
    reward,
    { ...reward, name: 'Foo', _id: '12345' }
]

export const rewardListWithUsers: RewardWithUsers[] = [
    rewardWithUsers,
    { ...rewardWithUsers, name: 'Foo', _id: '12345' }
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { claimers, handed, ...userReward } = reward
export { userReward }

export const userRewards = {
    available: [userReward],
    claimed: [userReward],
    received: [userReward]
}