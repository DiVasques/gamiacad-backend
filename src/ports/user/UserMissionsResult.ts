import { UserMission } from '@/models/UserMission'

export interface UserMissionsResult {
    active: UserMission[],
    participating: UserMission[],
    completed: UserMission[]
}