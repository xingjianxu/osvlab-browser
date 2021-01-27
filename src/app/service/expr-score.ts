import {Step} from './step';
import {Expr} from "@service/expr";

export class ExprScore {
  expr: Expr;

  score: number;

  static fromJSON(data: {}): ExprScore {
    return Object.assign(new this(), data);
  }
}
