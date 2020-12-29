import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Exam} from '@service/exam';
import {ExamService} from '@service/exam.service';
import {Expr} from '@service/expr';
import {switchMap} from 'rxjs/operators';
import {UserStateService} from "@service/user-state.service";
import {ExamUserState} from "@service/exam-user-state";
import {ExprUserState} from "@service/expr-user-state";

@Component({
  selector: 'app-student-exam-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.less'],
})
export class ViewComponent implements OnInit {
  examUserState: ExamUserState;
  exprUserStates: ExprUserState[];
  examLoading = true;
  exprsLoading = true;

  constructor(
    private userStateService: UserStateService,
    private examService: ExamService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.examLoading = true;
    this.activatedRoute.queryParamMap.pipe(switchMap((queryMap) => {
      return this.userStateService.getExamUserState(queryMap.get('examId'));
    })).subscribe((examUserState) => {
      this.examUserState = examUserState;
      this.examLoading = false;
    });

    this.exprsLoading = true;
    this.activatedRoute.queryParamMap.pipe(switchMap((queryMap) => {
      return this.userStateService.listExprUserStates(queryMap.get('examId'));
    })).subscribe((resp) => {
      this.exprUserStates = resp;
      this.exprsLoading = false;
    });
  }
}
