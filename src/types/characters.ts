export interface Character {
  code: string;
  name: string;
  image: string;
}

export interface CharacterUnlocked {
  characterCode: string;
  unlockedAt: string;
  level: number;
  characterPoints: number;
};

export interface CharacterWithProgress extends Character {
  unlocked: boolean;
  level: number;
  characterPoints: number;
  unlockedAt?: string | null;
}