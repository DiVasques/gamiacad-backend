import { Mission } from "@/models/Mission";

export interface UserMission extends Omit<Mission, "participants" | "completers"> {
    participating?: boolean
}