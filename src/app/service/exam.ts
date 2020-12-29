import { parseISO } from 'date-fns';
import { isBefore } from 'date-fns'
import {Expr} from './expr';
import {User} from './user';

export class Exam {
  id: number;
  title: string;
  description: string;
  startedAt: Date;
  endedAt: Date;
  createdAt: Date;
  exprs: Expr[];
  examinees: User[];

  get started() {
    return isBefore(this.startedAt, new Date());
  }

  get ended() {
    return isBefore(this.endedAt, new Date());
  }

  get ongoing() {
    return this.started && !this.ended;
  }

  static fromJSON(data: {}): Exam {
    const exam = Object.assign(new this(), data);
    ['startedAt', 'endedAt', 'createdAt'].forEach((p) => {
       exam[p] = parseISO(data[p]);
    });
    return exam;
  }
}
