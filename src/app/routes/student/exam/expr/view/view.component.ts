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
import {ExamUserHost} from "@service/exam-user-host";

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

  currentHostId = 1;
  rfb: RFB;
  hostStarting = false;
  hostStopping = false;

  examUserHosts: ExamUserHost[] = [];

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
      })),
      this.activatedRoute.queryParamMap.pipe(switchMap((params) => {
        return this.pveService.getExamUserHostsOfExpr(params.get('examId'), params.get('exprId'));
      })),
    ]).subscribe(([expr, stepScores, exam, examUserHostsR]) => {
      stepScores.forEach((stepScore) => {
        this.updateStepScore(expr.steps, stepScore);
      });
      this.expr = expr;
      this.exam = exam;
      this.titleService.setTitle(`实验: ${expr.title}`)
      this.setRemainTimer();
      if (!examUserHostsR.success) {
        this.messageService.error('加载主机信息错误！')
        return;
      }
      this.examUserHosts = examUserHostsR.data;
      this.connectHostVnc(this.currentHostId);
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

  connectHostVnc(hostId: number) {
    this.currentHostId = hostId;
    this.rfb?.disconnect();
    this.pveService.getHostVncConnection(this.exam.id, this.expr.id, this.currentHostId).subscribe((vncConnR) => {
      if (vncConnR.code == RC.VM_STOPPED) {
        return;
      }
      const conn = vncConnR.data;
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
    this.pveService.startHost(this.exam.id, this.expr.id, this.currentHostId).subscribe((r) => {
      switch (r.code) {
        case RC.SUCCESS:
          this.connectHostVnc(this.currentHostId);
          this.messageService.success('主机启动成功！')
          break;
        case RC.VM_NOTEXIST:
          this.messageService.error('主机不存在，请先重置虚拟机！')
          break;
      }
      this.hostStarting = false;
    });
  }

  stopHost() {
    this.hostStopping = true;
    this.pveService.stopHost(this.exam.id, this.expr.id, this.currentHostId).subscribe(() => {
      this.messageService.success('主机停机成功！');
    });
  }

  initHost() {
    this.pveService.initHost(this.exam.id, this.expr.id, this.currentHostId).subscribe((r) => {
      if (r.success) {
        this.messageService.success('主机重置成功！');
        this.startHost();
      }
    });
  }
}
