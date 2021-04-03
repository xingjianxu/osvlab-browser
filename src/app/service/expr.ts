import {Step} from './step';

export class Expr {
  id: number;
  title: string;
  hostCount: number;
  steps: Step[];
  score: number;

  get hostIds() {
    return [...new Array(this.hostCount+1).keys()].slice(1);
  }

  static fromJSON(data: {}): Expr {
    return Object.assign(new this(), data);
  }
}
