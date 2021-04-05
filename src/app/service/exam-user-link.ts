import {User} from "@service/user";
import {Exam} from "@service/exam";

export class ExamUserLink {
  user: User;
  seat: number;

  static fromJson(o) {
    o.exam = Exam.fromJSON(o.exam);
    o.user = User.fromJSON(o.user);
    return o;
  }
}
