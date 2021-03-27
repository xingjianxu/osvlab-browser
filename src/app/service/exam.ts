import { parseISO } from 'date-fns';
import { isBefore } from 'date-fns';
import { Expr } from './expr';
import { User } from './user';

export class Exam {
  id: number;
  title: string;
  description: string;
  startedAt: Date;
  endedAt: Date;
  createdAt: Date;
  examExprs: [];
  examinees: User[];
  fullScore: number;

  get exprs() {
    return this.examExprs.map((e) => {
      return Expr.fromJSON(e['expr']);
    });
  }

  get started() {
    return isBefore(this.startedAt, new Date());
  }

  get ended() {
    return isBefore(this.endedAt, new Date());
  }

  get ongoing() {
    return this.started && !this.ended;
  }

  get state() {
    return this.ongoing ? '进行中' : this.ended ? '已结束' : '未开始';
  }

  get hostsCount() {
    return this.exprs.reduce((acc, cur) => {
      return acc + cur.hostCount;
    }, 0);
  }

  static fromJSON(data: {}): Exam {
    const exam = Object.assign(new this(), data);
    ['startedAt', 'endedAt', 'createdAt'].forEach((p) => {
      exam[p] = parseISO(data[p]);
    });
    return exam;
  }
}
