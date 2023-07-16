import { UserMission } from '@/ports/user/UserMission';

export interface UserMissionsResult {
    active: UserMission[],
    participating: UserMission[],
    completed: UserMission[]
}