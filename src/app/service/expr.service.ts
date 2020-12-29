import {Injectable} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {Expr} from './expr';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ExprService {
  constructor(private httpClient: _HttpClient) {
  }

  list() {
    return this.httpClient.get<Expr[]>('api/expr/list').pipe(map((resp) => {
      return resp.map((e) => {
        return Expr.fromJSON(e);
      });
    }));
  }

  get(exprId: string) {
    return this.httpClient.get<Expr>('api/expr', {id: exprId}).pipe(map((resp) => {
      return Expr.fromJSON(resp);
    }));
  }

  save(expr: Expr) {
    return this.httpClient.post<Expr>('api/expr', expr);
  }

  saveStepsOrder(ids: number[]) {
    return this.httpClient.post('api/expr/saveStepsOrder', {ids});
  }
}
