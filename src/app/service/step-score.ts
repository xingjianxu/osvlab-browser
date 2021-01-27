import {Step} from './step';
import {Expr} from "@service/expr";

export class StepScore {
  userId: number;
  examId: number;
  stepId: number;
  score: number;

  static fromJSON(data: {}): StepScore {
    return Object.assign(new this(), data);
  }
}
