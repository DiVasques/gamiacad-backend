export interface User {
    _id: string
    name: string
    email: string
    balance: number
    totalPoints: number
    activeMissions: Array<string>
    pendingRewards: Array<string>
    completedMissions: Array<string>
    claimedRewards: Array<string>
    createdAt: Date
    updatedAt: Date
}