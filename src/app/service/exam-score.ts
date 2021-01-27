import {Exam} from "@service/exam";

export class ExamScore {
  exam: Exam;

  score: number;

  static fromJSON(data: {}): ExamScore {
    return Object.assign(new this(), data);
  }
}
