import { Dayjs } from "dayjs";
import { ProgressWorld } from "./worlds";
import { CharacterUnlocked } from "./characters";

interface MissionProgress {
    missionId: string;
    completed: boolean;
    assignedAt: string;
}

export interface Child {
  _id?: string;
  profilePicture: string | null;
  username: string;
  password?: string;
  name: string;
  audioActive: boolean | null;
  rankingActive: boolean | null;
  birthDate?: Dayjs | null
};

export interface ChildWithProgress extends Child {
  points: number;
  stellarPoints: number;
  coins: number;
  streak: number;
  completedPhases: number;
  selectedCharacter: string;
  worlds: Array<ProgressWorld>;
  dailyMissions: Array<MissionProgress>;
  characters: Array<CharacterUnlocked>;
}

export type RegisterChild = {
  profilePicture: string | null;
  username: string;
  password: string;
  name: string;
  birthDate: Dayjs | null;
};