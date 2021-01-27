import {Exam} from "@service/exam";

export class ExamScore {
  exam: Exam;

  score: number;

  static fromJSON(data: {}): ExamScore {
    const examScore = Object.assign(new this(), data);
    examScore.exam = Exam.fromJSON(examScore.exam);
    return examScore;
  }
}
