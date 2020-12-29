export class UserGroup {
  id: number;
  name: string;
  description: string;
  usersCount: number;

  static fromJSON(data: {}): UserGroup {
    return Object.assign(new this(), data);
  }
}
