import {Injectable} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {map} from "rxjs/operators";
import {R} from "@service/R";

@Injectable({
  providedIn: 'root',
})
export class PveService {
  constructor(private httpClient: _HttpClient) {
  }

  getVmVncConnection(examId: number, exprId: number, hostId: number) {
    return this.httpClient.get('api/pve/getVmVncConnection', {examId, exprId, hostId}).pipe(map((resp) => {
      return new R<{ticket: string, password: string}>(resp);
    }));
  }

  startVm(examId: number, exprId: number, hostId: number) {
    return this.httpClient.post('api/pve/startVm', {examId, exprId, hostId});
  }

  stopVm(examId: number, exprId: number, hostId: number) {
    return this.httpClient.post('api/pve/stopVm', {examId, exprId, hostId});
  }

  getVmStatus(examId: number, exprId: number, hostId: number) {
    return this.httpClient.post<string>('api/pve/getVmStatus', {examId, exprId, hostId});
  }
}
