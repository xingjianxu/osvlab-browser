import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Exam} from '@service/exam';
import {ExamService} from '@service/exam.service';
import {Expr} from '@service/expr';
import {ExprService} from '@service/expr.service';
import {Step} from '@service/step';
import {StepService} from '@service/step.service';
import {Subscription, timer, combineLatest} from 'rxjs';
import {delay, map, switchMap, take} from 'rxjs/operators';
import {differenceInSeconds} from 'date-fns';
import {StompRService} from "@stomp/ng2-stompjs";
import {ScoreService} from "@service/score.service";
import {StepScore} from "@service/step-score";

@Component({
  selector: 'app-student-expr-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.less'],
})
export class ViewComponent implements OnInit, OnDestroy {
  exam: Exam;
  expr: Expr;
  hostStats: [];
  steps: Step[];
  loading = false;
  remainTime: string;

  remainTime$: Subscription;
  hostConnectedTopic$: Subscription;
  stepCheckTopic$: Subscription;

  constructor(
    private userStateService: ScoreService,
    private examService: ExamService,
    private exprService: ExprService,
    private stepService: StepService,
    private activatedRoute: ActivatedRoute,
    private stompRService: StompRService,
  ) {
  }

  ngOnInit(): void {
    this.hostConnectedTopic$ = this.stompRService.watch('/user/topic/hostConnected').subscribe((msg) => {
      this.hostStats = JSON.parse(msg.body);
    });

    this.stepCheckTopic$ = this.stompRService.watch('/user/topic/stepCheck').subscribe((msg) => {
      if (this.expr) {
        this.updateStepScore(this.expr.steps, JSON.parse(msg.body));
      }
    });

    this.activatedRoute.queryParamMap.pipe(switchMap((params) => {
      return this.examService.findById(params.get('examId'));
    })).subscribe((exam) => {
      this.exam = exam;
      this.remainTime$?.unsubscribe();
      const remainedSeconds = differenceInSeconds(this.exam.endedAt, new Date());
      this.remainTime$ = timer(0, 1000).pipe(
        map((i) => remainedSeconds - i),
        take(remainedSeconds + 1),
      ).subscribe({
        next: (s) => {
          const hours = Math.floor(s / 3600);
          const minutes = Math.floor((s - hours * 3600) / 60);
          const seconds = s - hours * 3600 - minutes * 60;
          this.remainTime = `${hours.toString().toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        },
        complete: () => {
          this.remainTime = '考试结束，请交卷！';
        },
      });
    });

    combineLatest([
      this.activatedRoute.queryParamMap.pipe(switchMap((params) => {
        return this.exprService.get(params.get('exprId'));
      })),
      this.activatedRoute.queryParamMap.pipe(switchMap((params) => {
        return this.userStateService.getExprHostStates(params.get('examId'), params.get('exprId'));
      })),
      this.activatedRoute.queryParamMap.pipe(switchMap((params) => {
        return this.userStateService.listStepScores(params.get('examId'), params.get('exprId'));
      })),
    ]).subscribe(([expr, hostStats, stepScores]) => {
      this.hostStats = hostStats;
      stepScores.forEach((stepScore) => {
        this.updateStepScore(expr.steps, stepScore);
      });
      this.expr = expr;
    });
  }

  updateStepScore(steps: Step[], stepUserState: StepScore) {
    steps.forEach((step) => {
      if (step.id == stepUserState.stepId) {
        step.score = stepUserState.score;
        step.checking = false;
      }
    })
  }

  checkStep(step: Step, e) {
    e.stopPropagation();
    step.checking = true;
    this.userStateService.checkStep(this.exam.id, step.id).subscribe(() => {
    });
  }

  submitExpr() {
  }

  ngOnDestroy(): void {
    this.hostConnectedTopic$.unsubscribe();
  }
}
