import { Dayjs } from "dayjs";

export interface User {
  _id?: string;
  profilePicture: string | null;
  username: string;
  name: string;
  email: string | null;
  selectedChild: string | null;
  type: "parent" | "child";
};

export type UserProfile = Omit<User, "_id" | "selectedChild" | "type">;

export interface MedalItem {
  _id: string;
  name: string;
  description: string;
  date: string;
}

export interface Child {
  _id?: string;
  profilePicture: string | null;
  username: string;
  name: string;
  points: number;
  audio: boolean | null;
  phasesCompleted: number | null;
  medals: [MedalItem] | null;
  rankingActive: boolean | null;
};

export type ChildDataDashboard = Omit<Child, "_id" | "audio" | "rankingActive">;

export type BodyRegisterType = {
  profilePicture: string | null;
  username: string;
  password: string;
  name: string;
  email?: string;
  birthDate: Dayjs | null;
};
