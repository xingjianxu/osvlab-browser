export class Step {
  id: number;
  title: string;
  description: string;
  hostId: number;
  score = -1;
  scoreScript: string;
  fullScore: number;
  idx: number;
  checking = false;

  static fromJSON(data: {}): Step {
    return Object.assign(new this(), data);
  }
}
