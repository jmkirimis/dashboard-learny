export type User = {
  id: string;
  profilePicture?: string;
  username: string;
  name: string;
  email: string;
  selectedChild?: string;
  type?: "parent" | "child";
};

export type Child = {
  profilePicture?: string;
  username: string;
  points: number;
  fasesConcluidas: number;
  medalhas: number;
  name: string;
};
