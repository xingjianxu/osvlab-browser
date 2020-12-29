import { Step } from './step';

export class Expr {
  id: number;
  title: string;
  hostCount: number;
  steps: Step[];

  get hostIds() {
    return [...new Array(this.hostCount).keys()];
  }

  static fromJSON(data: {}): Expr {
    return Object.assign(new this(), data);
  }
}
