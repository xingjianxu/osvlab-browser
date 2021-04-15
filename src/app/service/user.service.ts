import {Injectable} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {User} from './user';
import {R} from "@service/r";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpClient: _HttpClient) {

  }

  list(): Observable<User[]> {
    return this.httpClient.get<any[]>('api/user/list').pipe(map((resp) => {
      return resp.map((e) => {
        return User.fromJSON(e);
      });
    }));
  }

  find(userId: string) {
    return this.httpClient.get<User>('api/user', {userId}).pipe(map((resp) => {
      return User.fromJSON(resp);
    }));
  }

  updatePassword(curPassword: string, newPassword: string) {
    return this.httpClient.post('api/user/updatePassword', {curPassword, newPassword}).pipe(map((resp) => {
      return new R(resp);
    }));
  }
}
