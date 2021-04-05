import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Exam} from '@service/exam';
import {ExamService} from '@service/exam.service';
import {Expr} from '@service/expr';
import {ExprService} from '@service/expr.service';
import {Step} from '@service/step';
import {StepService} from '@service/step.service';
import {Subscription, timer, combineLatest} from 'rxjs';
import {map, switchMap, take} from 'rxjs/operators';
import {differenceInSeconds} from 'date-fns';
import {StompRService} from "@stomp/ng2-stompjs";
import {ScoreService} from "@service/score.service";
import {StepScore} from "@service/step-score";
import RFB from '@novnc/novnc/core/rfb';
import {DA_SERVICE_TOKEN, ITokenService} from "@delon/auth";
import {PveService} from "@service/pve.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {RC} from "@service/RC";
import {TitleService} from "@delon/theme";

@Component({
  selector: 'app-student-expr-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.less'],
})
export class ViewComponent implements OnInit, OnDestroy {
  exam: Exam;
  expr: Expr;
  steps: Step[];
  loading = false;
  remainTime: string;

  remainTime$: Subscription;
  stepCheckTopic$: Subscription;

  activeStepId = -1;

  @ViewChild('vnc') vncElm: ElementRef;

  currentHost = 1;
  rfb: RFB;
  hostStarting = false;
  hostStopping = false;

  constructor(
    private userStateService: ScoreService,
    private examService: ExamService,
    private exprService: ExprService,
    private stepService: StepService,
    private pveService: PveService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private messageService: NzMessageService,
    private titleService: TitleService,
    private activatedRoute: ActivatedRoute,
    private stompRService: StompRService,
  ) {
  }

  ngOnInit(): void {
    this.stepCheckTopic$ = this.stompRService.watch('/user/topic/stepCheck').subscribe((msg) => {
      if (this.expr) {
        this.updateStepScore(this.expr.steps, JSON.parse(msg.body));
      }
    });

    combineLatest([
      this.activatedRoute.queryParamMap.pipe(switchMap((params) => {
        return this.exprService.get(params.get('exprId'));
      })),
      this.activatedRoute.queryParamMap.pipe(switchMap((params) => {
        return this.userStateService.listStepScores(params.get('examId'), params.get('exprId'));
      })),
      this.activatedRoute.queryParamMap.pipe(switchMap((params) => {
        return this.examService.findById(params.get('examId'));
      }))
    ]).subscribe(([expr, stepScores, exam]) => {
      stepScores.forEach((stepScore) => {
        this.updateStepScore(expr.steps, stepScore);
      });
      this.expr = expr;
      this.exam = exam;
      this.titleService.setTitle(`实验: ${expr.title}`)
      this.setRemainTimer();
      this.connectHostVnc(this.currentHost);
    });
  }

  setRemainTimer() {
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
    this.userStateService.checkStep(this.exam.id, step.id).subscribe((r) => {
      switch (r.code) {
        case RC.VM_STOPPED:
          this.messageService.error('主机未开机，开机后方可评分！');
          break;
        case RC.UNKNOWN:
          this.messageService.error('评分时发生未知错误，请检查主机状态！');
          break;
      }
      if (!r.success) {
        step.checking = false;
      }
    });
  }

  submitExpr() {
  }

  ngOnDestroy(): void {
    this.stepCheckTopic$.unsubscribe();
  }

  setActiveStep(stepId) {
    if (this.activeStepId == stepId) {
      this.activeStepId = -1;
    } else {
      this.activeStepId = stepId;
    }
  }

  connectHostVnc(host: number) {
    this.currentHost = host;
    this.rfb?.disconnect();
    this.pveService.getVmVncConnection(this.exam.id, this.expr.id, this.currentHost).subscribe((r) => {
      if (r.code == RC.VM_STOPPED) {
        return;
      }
      const conn = r.data;
      this.rfb = new RFB(
        this.vncElm.nativeElement,
        ViewComponent.getVncWsUrl(conn.ticket),
        {credentials: {password: conn.password}}
      );
      this.rfb.addEventListener('disconnect', () => {
        this.rfb = null;
        this.hostStopping = false;
      });
    });
  }

  private static getVncWsUrl(ticket: string): string {
    let url;
    if (window.location.protocol === "https:") {
      url = 'wss';
    } else {
      url = 'ws';
    }
    url += '://' + window.location.hostname;
    url += ':' + window.location.port;
    return url + '/api/ws/vnc?' + ticket;
  }

  startHost() {
    this.hostStarting = true;
    this.pveService.startVm(this.exam.id, this.expr.id, this.currentHost).subscribe(() => {
      this.hostStarting = false;
      this.connectHostVnc(this.currentHost);
    });
  }

  stopHost() {
    this.hostStopping = true;
    this.pveService.stopVm(this.exam.id, this.expr.id, this.currentHost).subscribe(() => {
      this.messageService.success('成功发出停机指令！');
    });
  }
}
