type RepSetConstructor = {
  hits ?: number;
  misses ?: number;
  goal ?: number;
  from ?: RepSet;
  as ?: RepSet;
};

export class RepSet {
  updatedAt: string;
  hits: number;
  misses: number;
  goal: number;
  undo: RepSet | undefined;

  constructor(params : RepSetConstructor) {
    let {
      hits = 0,
      misses = 0,
      goal,
      updatedAt
    } = params?.as ?? {...{...params.from, updatedAt: undefined}, ...params};
    this.updatedAt = updatedAt ?? new Date().toJSON();
    this.hits = hits;
    this.misses = misses;
    this.goal = goal;
    this.undo = params?.as?.undo ?? params.from;
  }

  get throws() {
    return this.hits + this.misses;
  }
};
