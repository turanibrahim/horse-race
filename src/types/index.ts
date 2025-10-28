export interface Horse {
  id: number;
  name: string;
  color: string;
  conditionScore: number;
}

export interface RaceResult {
  horseId: number;
  horseName: string;
  finishTime: number;
  position: number;
}

export interface Race {
  round: number;
  distance: number;
  horses: Horse[];
  results: RaceResult[];
  isCompleted: boolean;
}
