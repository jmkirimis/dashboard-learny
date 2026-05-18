type Phase = {
  code: string;
  name: string;
  order: number;
  type: string;
  completed: boolean;
};

export type PhaseCompleted = {
  phaseCode: string;
  time: string;
  points: number;
  percentage: number;
  completed: boolean
}

export type World = {
  code: string;
  name: string;
  modules: Module[];
};

export interface WorldInfoCatalog{
  code: string;
  name: string;
  description: string;
  color: string;
  order: number;
  picture: string;
}

export interface ProgressWorld {
  worldCode: string;
  percentage: number;
  completedPhases: Array<PhaseCompleted>;
  unlocked: boolean;
}

export type WorldWithProgress = WorldInfoCatalog & {
  percentage: number;
  completedPhases: Array<PhaseCompleted>;
  unlocked: boolean;
};

export type Module = {
  code: string;
  worldCode: string;
  name: string;
  order: number;
  phases: Phase[];
};