import { Mission } from "@/models/Mission";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserMission extends Omit<Mission, "participants" | "completers"> {}