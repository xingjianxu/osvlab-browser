import {Step} from './step';
import {Expr} from "@service/expr";

export class StepUserState {
  userId: number;
  examId: number;
  stepId: number;
  score: number;

  static fromJSON(data: {}): StepUserState {
    return Object.assign(new this(), data);
  }
}
