import { Dayjs } from "dayjs";

export type User = {
  id: string;
  profilePicture: string | null;
  username: string;
  name: string;
  email: string | null;
  selectedChild: string;
  type: "parent" | "child";
};

export type Child = {
  id?: string;
  profilePicture: string | null;
  username: string;
  name: string;
  points: number;
  audio: boolean | null;
  phasesCompleted: number | null;
  medals: number | null;
  rankingActive: boolean | null;
};

export type BodyRegisterType = {
  profilePicture: string | null;
  username: string;
  password: string;
  name: string;
  email?: string;
  birthDate: Dayjs | null;
};
