import {Injectable} from '@angular/core';
import {_HttpClient} from '@delon/theme';

@Injectable({
  providedIn: 'root',
})
export class PveService {
  constructor(private httpClient: _HttpClient) {
  }

  getVmVncConnection(examId: number, exprId: number, hostId: number) {
    return this.httpClient.get<{ticket: string, password: string}>('api/pve/getVmVncConnection', {examId, exprId, hostId});
  }

  startVm(examId: number, exprId: number, hostId: number) {
    return this.httpClient.post('api/pve/startVm', {examId, exprId, hostId});
  }

  stopVm(examId: number, exprId: number, hostId: number) {
    return this.httpClient.post('api/pve/stopVm', {examId, exprId, hostId});
  }
}
