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
    this.updatedAt = new Date().toJSON();
    let {
      hits = 0,
      misses = 0,
      goal,
    } = params?.as ?? {...params.from, ...params};
    this.hits = hits;
    this.misses = misses;
    this.goal = goal;
    this.undo = params?.as?.undo ?? params.from;
  }

  get throws() {
    return this.hits + this.misses;
  }
};
