import {Injectable} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Exam} from './exam';
import {Expr} from './expr';
import {User} from './user';
import {ScoreStat} from '@service/score-stat';
import {ExamineeStat} from '@service/examinee-stat';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  constructor(private httpClient: _HttpClient) {
  }

  list(): Observable<Exam[]> {
    return this.httpClient.get<any[]>('api/exam/list').pipe(
      map((resp) => {
        return resp.map((e) => {
          return Exam.fromJSON(e);
        });
      }),
    );
  }

  listCurrentUserExams(): Observable<Exam[]> {
    return this.httpClient.get<any[]>('api/exam/listCurrentUserExams').pipe(
      map((resp) => {
        return resp.map((e) => {
          return Exam.fromJSON(e);
        });
      }),
    );
  }

  findById(examId: string | number) {
    return this.httpClient
      .get<{}>('api/exam', {id: examId})
      .pipe(
        map((e) => {
          return Exam.fromJSON(e);
        }),
      );
  }

  save(exam: Exam) {
    return this.httpClient.post<Exam>('api/exam', exam);
  }

  updateExpr(examId: number | string, exprId: number | string, vmIdPrefix: number | string) {
    return this.httpClient.post<number>('api/exam/updateExpr', {examId, exprId, vmIdPrefix});
  }

  removeExpr(examId: number | string, exprId: number | string) {
    return this.httpClient.delete('api/exam/removeExpr', {examId, exprId});
  }

  getCurrentUserExprs(examId: number | string) {
    return this.httpClient
      .get<{ expr: Expr; score: number }[]>('api/exam/currentUserExprs', {examId})
      .pipe(
        map((resp) => {
          return resp.map((e) => {
            return Expr.fromJSON({...e.expr, score: e.score});
          });
        }),
      );
  }

  getExaminees(examId: number) {
    return this.httpClient.get<User[]>('api/exam/examinees', {examId});
  }

  getExamineeStats(examId: number) {
    return this.httpClient.get<ExamineeStat[]>('api/exam/getExamineeStats', {examId});
  }

  addExaminees(examId: number, userGroupIds: number[] | string[]) {
    return this.httpClient.post<number>('api/exam/examinees', {examId, userGroupIds});
  }

  removeAllExaminees(examId: number | string) {
    return this.httpClient.delete<number>('api/exam/examinees', {examId});
  }

  scoreStats(examId: number | string) {
    return this.httpClient.get<ScoreStat[]>('api/exam/scoreStats', {examId});
  }
}
