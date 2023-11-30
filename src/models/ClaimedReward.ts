export interface ClaimedReward {
    _id: string
    name: string
    number: number
    price: number
    claimer: {
        id: string
        name: string
        registration: string
    },
    claimDate: Date
}