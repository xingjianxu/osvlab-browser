import {Injectable} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {Expr} from './expr';
import {map} from 'rxjs/operators';
import {ExamUserState} from "@service/exam-user-state";
import {ExprUserState} from "@service/expr-user-state";

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  constructor(private httpClient: _HttpClient) {
  }

  getExamUserState(examId: string | number) {
    return this.httpClient.get<ExamUserState>('api/exam/userstate/getExamUserState', {examId}).pipe(map((resp) => {
      return ExamUserState.fromJSON(resp);
    }));
  }

  listExprUserStates(examId: string | number) {
    return this.httpClient.get<{}[]>('api/exam/userstate/listExprUserStates', {examId}).pipe(map((resp) => {
      return resp.map((e) => {
        return ExprUserState.fromJSON(e);
      });
    }));
  }

  getExprHostStates(examId: number | string, exprId: number | string) {
    return this.httpClient.get<[]>('api/exam/userstate/listExprHostStates', {examId, exprId});
  }

  listStepUserStates(examId: number | string, exprId: number | string) {
    return this.httpClient.get<[]>('api/exam/userstate/listStepUserStates', {examId, exprId});
  }

  checkStep(examId: string | number, stepId: string | number) {
    return this.httpClient.get<number>('api/exam/userstate/checkStep', { examId, stepId });
  }
}
