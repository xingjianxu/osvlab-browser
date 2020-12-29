import {Step} from './step';
import {Expr} from "@service/expr";

export class ExprUserState {
  expr: Expr;

  score: number;

  static fromJSON(data: {}): ExprUserState {
    return Object.assign(new this(), data);
  }
}
