import {Role} from './role';

export class User {
  id: number;
  username: string;
  fullName: string;
  email: string;

  roles: Role[] = [];

  get roleNames() {
    return this.roles.map((role) => role.name);
  }

  static fromJSON(data: {}): User {
    return Object.assign(new this, data);
  }
}
