export interface Mission {
    _id: string
    name: string
    description: string
    points: number
    expirationDate: Date
    createdAt: Date
    updatedAt: Date
    createdBy: string
    participants: Array<any>
    completers: Array<any>
}