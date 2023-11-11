import { ActionWithDate } from '@/models/ActionWithDate'

export interface Reward {
    _id: string
    number: number
    name: string
    description: string
    price: number
    availability: number
    createdAt: Date
    updatedAt: Date
    claimers: Array<ActionWithDate>
    handed: Array<ActionWithDate>
    active: boolean
}