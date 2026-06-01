import { Dayjs } from "dayjs";

export interface User {
  _id?: string;
  profilePicture: string | null;
  username: string;
  name: string;
  email: string | null;
  selectedChild: string | null;
  type?: "parent" | "child";
  password?: string;
  birthDate?: Dayjs | null;
};

export interface TokenPayload {
  user: User
}