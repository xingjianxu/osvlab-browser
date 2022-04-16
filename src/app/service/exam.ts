import { ExamUserLink } from '@service/exam-user-link';
import { parseISO, isBefore } from 'date-fns';

import { Expr } from './expr';

export class Exam {
  id: number;
  title: string;
  description: string;
  startedAt: Date;
  endedAt: Date;
  createdAt: Date;
  examExprs: Array<{ expr: Expr }>;
  examUserLinks: ExamUserLink[];
  fullScore: number;

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

  get hostCount() {
    return this.examExprs.reduce((acc, cur) => {
      return acc + cur['expr']['hostCount'];
    }, 0);
  }

  static fromJSON(data: {}): Exam {
    const exam = Object.assign(new this(), data);
    ['startedAt', 'endedAt', 'createdAt'].forEach(p => {
      exam[p] = parseISO(data[p]);
    });
    return exam;
  }
}
