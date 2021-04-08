import {Injectable} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {map} from "rxjs/operators";
import {R} from "@service/r";
import {ExamUserHost} from "@service/exam-user-host";

@Injectable({
  providedIn: 'root',
})
export class PveService {
  constructor(private httpClient: _HttpClient) {
  }

  getHostVncConnection(examId: number, exprId: number, hostId: number) {
    return this.httpClient.get('api/pve/getHostVncConnection', {examId, exprId, hostId}).pipe(map((resp) => {
      return new R<{ ticket: string, password: string }>(resp);
    }));
  }

  startHost(examId: number, exprId: number, hostId: number) {
    return this.httpClient.post('api/pve/startHost', {examId, exprId, hostId}).pipe(map((resp) => {
      return new R(resp);
    }));
  }

  stopHost(examId: number, exprId: number, hostId: number) {
    return this.httpClient.post('api/pve/stopHost', {examId, exprId, hostId});
  }

  getHostStatus(examId: number, exprId: number, hostId: number) {
    return this.httpClient.post<string>('api/pve/getHostStatus', {examId, exprId, hostId});
  }

  initHost(examId: number, exprId: number, hostId: number) {
    return this.httpClient.post('api/pve/initHost', {examId, exprId, hostId}).pipe(
      map((resp) => {
        return new R(resp);
      })
    );
  }

  initUserHost(userId: number, examId: number, exprId: number, hostId: number) {
    return this.httpClient.post('api/pve/initUserHost', {userId, examId, exprId, hostId}).pipe(
      map((resp) => {
        return new R(resp);
      })
    );
  }

  getExamUserHost(examId: number | string, exprId: number | string, hostId: number | string) {
    return this.httpClient.get<{}>('api/pve/getExamUserHost', {examId, exprId, hostId}).pipe(
      map((resp) => {
        return new R<ExamUserHost>(resp);
      })
    );
  }

  getExamUserHostsOfExpr(examId: number | string, exprId: number | string) {
    return this.httpClient.get<{}>('api/pve/getExamUserHostsOfExpr', {examId, exprId}).pipe(
      map((resp) => {
        return new R<ExamUserHost[]>(resp);
      })
    );
  }

  getAllExamUserHosts(examId: number) {
    return this.httpClient.get<{}>('api/pve/getAllExamUserHosts', {examId}).pipe(
      map((resp) => {
        return new R<{ string: ExamUserHost }>(resp);
      })
    );
  }
}
