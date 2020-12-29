import {Exam} from "@service/exam";

export class ExamUserState {
  exam: Exam;

  score: number;

  static fromJSON(data: {}): ExamUserState {
    return Object.assign(new this(), data);
  }
}
