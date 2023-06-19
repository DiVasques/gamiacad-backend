export interface User {
    _id: string
    name: string
    email: string
    balance: number
    totalPoints: number
    activeMissions: Array<any>
    pendingRewards: Array<any>
    completedMissions: Array<any>
    claimedRewards: Array<any>
    createdAt: Date
    updatedAt: Date
}