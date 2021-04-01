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
export class PveService {
  constructor(private httpClient: _HttpClient) {
  }

  getVmVncConnection(examId: number, exprId: number, hostId: number) {
    return this.httpClient.get<{ticket: string, password: string}>('api/pve/getVmVncConnection', {examId, exprId, hostId});
  }
}
