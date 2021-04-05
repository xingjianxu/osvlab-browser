import {Injectable} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {map} from 'rxjs/operators';
import {ExamScore} from "@service/exam-score";
import {ExprScore} from "@service/expr-score";
import {R} from "@service/r";

@Injectable({
  providedIn: 'root',
})
export class ScoreService {
  constructor(private httpClient: _HttpClient) {
  }

  getExamScore(examId: string | number) {
    return this.httpClient.get<ExamScore>('api/exam/score/getExamScore', {examId}).pipe(map((resp) => {
      return ExamScore.fromJSON(resp);
    }));
  }

  listExprScores(examId: string | number) {
    return this.httpClient.get<{}[]>('api/exam/score/listExprScores', {examId}).pipe(map((resp) => {
      return resp.map((e) => {
        return ExprScore.fromJSON(e);
      });
    }));
  }

  listStepScores(examId: number | string, exprId: number | string) {
    return this.httpClient.get<[]>('api/exam/score/listStepScores', {examId, exprId});
  }

  checkStep(examId: string | number, stepId: string | number) {
    return this.httpClient.get<{}>('api/exam/score/checkStep', {examId, stepId}).pipe(map((resp) => {
      return new R(resp);
    }));
  }
}
