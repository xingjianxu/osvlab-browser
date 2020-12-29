import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './user';
import { UserGroup } from './user-group';

@Injectable({
  providedIn: 'root',
})
export class UserGroupService {
  constructor(private httpClient: _HttpClient) {}

  list(): Observable<UserGroup[]> {
    return this.httpClient.get<any[]>('api/user/group/list').pipe(
      map((resp) => {
        return resp.map((e) => {
          return UserGroup.fromJSON(e);
        });
      }),
    );
  }

  get(groupId: string) {
    return this.httpClient.get<UserGroup>('api/user/group', { groupId });
  }

  getUsers(groupId: number | string) {
    return this.httpClient.get<User[]>('api/user/group/users', { groupId });
  }

  save(userGroup: UserGroup) {
    return this.httpClient.post<UserGroup>('api/user/group', userGroup);
  }

  bindUsers(groupId: number, users: User[]) {
    return this.httpClient.post<User[]>('api/user/group/bind', { groupId, users });
  }

  unbindUsers(groupId: number, userIds: number[]) {
    return this.httpClient.post<number>('api/user/group/unbind', { groupId, userIds });
  }
}
