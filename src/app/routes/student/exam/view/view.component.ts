import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Exam} from '@service/exam';
import {ExamService} from '@service/exam.service';
import {Expr} from '@service/expr';
import {switchMap} from 'rxjs/operators';
import {ScoreService} from "@service/score.service";
import {ExamScore} from "@service/exam-score";
import {ExprScore} from "@service/expr-score";

@Component({
  selector: 'app-student-exam-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.less'],
})
export class ViewComponent implements OnInit {
  examScore: ExamScore;
  exprScores: ExprScore[];
  examLoading = true;
  exprsLoading = true;

  constructor(
    private scoreService: ScoreService,
    private examService: ExamService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.examLoading = true;
    this.activatedRoute.queryParamMap.pipe(switchMap((queryMap) => {
      return this.scoreService.getExamScore(queryMap.get('examId'));
    })).subscribe((examScore) => {
      this.examScore = examScore;
      this.examLoading = false;
    });

    this.exprsLoading = true;
    this.activatedRoute.queryParamMap.pipe(switchMap((queryMap) => {
      return this.scoreService.listExprScores(queryMap.get('examId'));
    })).subscribe((resp) => {
      this.exprScores = resp;
      this.exprsLoading = false;
    });
  }
}
