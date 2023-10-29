export interface Reward {
    _id: string
    number: number
    name: string
    description: string
    price: number
    availability: number
    createdAt: Date
    updatedAt: Date
    claimers: Array<string>
    handed: Array<string>
    active: boolean
}