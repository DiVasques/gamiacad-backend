import { ActionWithDate } from '@/models/ActionWithDate'

export interface Mission {
    _id: string
    number: number
    name: string
    description: string
    points: number
    expirationDate: Date
    createdAt: Date
    updatedAt: Date
    createdBy: string
    participants: Array<ActionWithDate>
    completers: Array<ActionWithDate>
    active: boolean
}