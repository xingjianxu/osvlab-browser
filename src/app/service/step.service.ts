import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Step } from './step';
import { map } from 'rxjs/operators';
import { Expr } from '@service/expr';

@Injectable({
  providedIn: 'root',
})
export class StepService {
  constructor(private httpClient: _HttpClient) {}

  check(examId: string | number, stepId: string | number) {
    return this.httpClient.get<number>('api/step/check', { examId, stepId });
  }

  save(step: Step) {
    return this.httpClient.post<Step>('api/step', step);
  }

  find(stepId: string) {
    return this.httpClient
      .get<Step>('api/step', { stepId })
      .pipe(
        map((resp) => {
          return Step.fromJSON(resp);
        }),
      );
  }
}
