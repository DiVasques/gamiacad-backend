import { Mission } from '@/models/Mission'
import { User } from '@/models/User'

export interface MissionWithUsers extends Mission {
    participantsInfo: User[]
    completersInfo: User[]
    createdByInfo: User
}