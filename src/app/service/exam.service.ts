import {Injectable} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Exam} from './exam';
import {Expr} from './expr';
import {User} from './user';
import {ScoreStat} from '@service/score-stat';
import {ExamUserLink} from '@service/exam-user-link';
import {R} from "@service/r";
import {ExamUserHost} from "@service/exam-user-host";

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

  listCurrentUserExams(): Observable<R<ExamUserLink[]>> {
    return this.httpClient.get<[]>('api/exam/listCurrentUserExams').pipe(
      map((resp) => {
        return new R(resp, (o) => o.map((e) => ExamUserLink.fromJson(e)));
      })
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

  saveExpr(examId: number | string, examExpr) {
    return this.httpClient.post<number>('api/exam/saveExpr', {examId, ...examExpr});
  }

  removeExpr(examId: number | string, exprId: number | string) {
    return this.httpClient.delete('api/exam/removeExpr', {examId, exprId});
  }

  getCurrentUserExprs(examId: number | string) {
    return this.httpClient.get<{ expr: Expr; score: number }[]>('api/exam/currentUserExprs', {examId}).pipe(
      map((resp) => {
        return resp.map((e) => {
          return Expr.fromJSON({...e.expr, score: e.score});
        });
      }),
    );
  }

  getExamUserLinks(examId: number) {
    return this.httpClient.get<ExamUserLink[]>('api/exam/getExamUserLinks', {examId});
  }

  addUserGroups(examId: number, userGroupIds: number[] | string[]) {
    return this.httpClient.post<number>('api/exam/addUserGroups', {examId, userGroupIds});
  }

  addUsers(examId: number, usernames: string[]) {
    return this.httpClient.post<number>('api/exam/addUsers', {examId, usernames});
  }

  removeAllUsers(examId: number | string) {
    return this.httpClient.delete<R<void>>('api/exam/removeAllUsers', {examId}).pipe(
      map((resp) => {
        return new R(resp);
      })
    );
  }

  removeUsers(examId: number, userIds: number[]) {
    return this.httpClient.delete<R<void>>('api/exam/removeUsers', {examId, userIds}).pipe(
      map((resp) => {
        return new R(resp);
      })
    );
  }

  scoreStats(examId: number | string) {
    return this.httpClient.get<ScoreStat[]>('api/exam/scoreStats', {examId});
  }

  shuffleSeats(examId: number) {
    return this.httpClient.put('api/exam/shuffleSeats', {examId}).pipe(
      map((resp) => {
        return new R(resp);
      })
    );

  }
}
