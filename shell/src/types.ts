export type repSetType = {
  updatedAt: string;
  hits: number;
  misses: number;
  repGoal: number;
  undo: repSetType | undefined;
};
