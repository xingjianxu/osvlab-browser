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
  examUserState: ExamScore;
  exprUserStates: ExprScore[];
  examLoading = true;
  exprsLoading = true;

  constructor(
    private userStateService: ScoreService,
    private examService: ExamService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.examLoading = true;
    this.activatedRoute.queryParamMap.pipe(switchMap((queryMap) => {
      return this.userStateService.getExamScoreUS(queryMap.get('examId'));
    })).subscribe((examUserState) => {
      this.examUserState = examUserState;
      this.examLoading = false;
    });

    this.exprsLoading = true;
    this.activatedRoute.queryParamMap.pipe(switchMap((queryMap) => {
      return this.userStateService.listExprScoreUSs(queryMap.get('examId'));
    })).subscribe((resp) => {
      this.exprUserStates = resp;
      this.exprsLoading = false;
    });
  }
}
