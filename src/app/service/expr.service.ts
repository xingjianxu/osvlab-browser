import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { R } from '@service/r';
import { map } from 'rxjs/operators';

import { Expr } from './expr';

@Injectable({
  providedIn: 'root'
})
export class ExprService {
  constructor(private httpClient: _HttpClient) {}

  list() {
    return this.httpClient.get<R<Expr[]>>('api/expr/list').pipe(
      map(r => {
        return r.data.map(e => {
          return Expr.fromJSON(e);
        });
      })
    );
  }

  get(exprId: string) {
    return this.httpClient.get<R<Expr>>('api/expr', { id: exprId }).pipe(
      map(resp => {
        return Expr.fromJSON(resp.data);
      })
    );
  }

  save(expr: Expr) {
    return this.httpClient.post<R<Expr>>('api/expr', expr).pipe(
      map(r => {
        return Expr.fromJSON(r.data);
      })
    );
  }

  saveStepsOrder(ids: number[]) {
    return this.httpClient.post('api/expr/saveStepsOrder', { ids });
  }
}
