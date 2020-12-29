import {Injectable} from '@angular/core';
import {_HttpClient} from '@delon/theme';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {User} from './user';
import {UserGroup} from './user-group';

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
}
