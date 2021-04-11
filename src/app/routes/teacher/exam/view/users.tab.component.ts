import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ModalHelper} from '@delon/theme';
import {NzMessageService} from 'ng-zorro-antd/message';
import {switchMap} from 'rxjs/operators';
import {Exam} from '@service/exam';
import {ExamService} from '@service/exam.service';
import {AddUserGroupsComponent} from './add-user-group/add-user-groups.component';
import {ExamUserLink} from "@service/exam-user-link";
import {PveService} from "@service/pve.service";
import {Expr} from "@service/expr";
import {combineLatest, Subscription} from "rxjs";
import {ExamUserHost} from "@service/exam-user-host";
import {NzModalService} from "ng-zorro-antd/modal";
import {AddUsersComponent} from "./add-users/add-users.component";
import {StompRService} from "@stomp/ng2-stompjs";

@Component({
  selector: 'app-teacher-exam-view-users-tab',
  templateUrl: './users.tab.component.html',
})
export class ExamViewUsersTabComponent implements OnInit, OnDestroy {
  examUserLinks: ExamUserLink[];
  loading = true;

  _exam: Exam;
  exprs: Expr[];
  userHostsMapping: { string: ExamUserHost };

  initAllExamHosts$: Subscription;
  deleteExamAllHosts$: Subscription;
  initUserHosts$: Subscription;
  initUserHost$: Subscription;
  removeUsers$: Subscription;

  @Input()
  set exam(exam: Exam) {
    if (exam.id) {
      if (exam.id == this._exam?.id) {
        return;
      }
      this.loading = true;
      this._exam = exam;
      this.exprs = this._exam.examExprs.map((e) => {
        return Expr.fromJSON(e.expr);
      });
      this.refreshUsers();
    }
  }

  constructor(
    private examService: ExamService,
    private modalHelper: ModalHelper,
    private pveService: PveService,
    private stompRService: StompRService,
    private modal: NzModalService,
    private msgService: NzMessageService) {
  }

  ngOnInit(): void {
    this.initSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroySubscription();
  }

  initSubscriptions() {
    this.initAllExamHosts$ = this.stompRService.watch('/topic/admin/pve/initAllExamHosts').subscribe((r) => {
      this.msgService.success('成功分配所有考生主机！');
      this.refreshUsers();
    });
    this.deleteExamAllHosts$ = this.stompRService.watch('/topic/admin/pve/deleteExamAllHosts').subscribe((r) => {
      this.msgService.success('成功删除所有考生主机！');
      this.refreshUsers();
    });
    this.initUserHosts$ = this.stompRService.watch('/topic/admin/pve/initUserHosts').subscribe((r) => {
      this.msgService.success('成功分配考生的所有主机！');
      this.refreshUsers();
    });
    this.initUserHost$ = this.stompRService.watch('/topic/admin/pve/initUserHost').subscribe((r) => {
      this.msgService.success('成功为考生分配该主机！');
      this.refreshUsers();
    });
    this.removeUsers$ = this.stompRService.watch('/topic/admin/exam/removeUsers').subscribe((r) => {
      this.msgService.success('成功移除考生！');
      this.refreshUsers();
    });
  }

  destroySubscription() {
    this.initAllExamHosts$.unsubscribe();
    this.deleteExamAllHosts$.unsubscribe();
    this.initUserHosts$.unsubscribe();
    this.initUserHost$.unsubscribe();
    this.removeUsers$.unsubscribe();
  }

  refreshUsers() {
    this.loading = true;
    combineLatest([
      this.examService.getExamUserLinks(this._exam.id),
      this.pveService.getAllExamUserHosts(this._exam.id),
    ]).subscribe(([examUserLinks, userHostsR]) => {
      this.examUserLinks = examUserLinks;
      this.userHostsMapping = userHostsR.data;
      this.loading = false;
    });
  }

  addUserGroups() {
    this.modalHelper.create(AddUserGroupsComponent, {exam: this._exam}, {size: 'md'}).subscribe(() => {
      this.refreshUsers();
    });
  }

  addUsers() {
    this.modalHelper.create(AddUsersComponent, {exam: this._exam}, {size: 'md'}).subscribe(() => {
      this.refreshUsers();
    });
  }

  removeAllUsers() {
    this.loading = true;
    this.examService.removeAllUsers(this._exam.id).subscribe((r) => {
      if (r.success) {
        this.msgService.success('成功删除所有考试学生!');
        return this.examService.getExamUserLinks(this._exam.id);
      } else {
        this.msgService.success('发生未知错误！');
      }
      this.refreshUsers();
    });
  }

  initUserHost(userId: number, exprId: number, hostId: number) {
    this.loading = true;
    this.pveService.initUserHost(userId, this._exam.id, exprId, hostId).subscribe((r) => {
      this.msgService.success('正在分配考生主机');
    });
  }

  showNetworkInfo(examUserHost: ExamUserHost) {
    this.modal.success({
      nzTitle: `网络信息：VMID[${examUserHost.vmId}]`,
      nzContent: `<dl>
                  <dt>CIDR</dt>
                  <dd>${examUserHost.cidr}</dd>
                  <dt>网关</dt>
                  <dd>${examUserHost.gw}</dd>
                  </dl>`
    });
  }

  removeUsers(userIds: number[]) {
    this.loading = true;
    this.examService.removeUsers(this._exam.id, userIds).subscribe((r) => {
      this.msgService.success('正在移除学生！');
    });
  }

  lockUserInExam() {
  }

  deleteExamAllHosts() {
    this.loading = true;
    this.pveService.deleteExamAllHosts(this._exam.id).subscribe(() => {
      this.msgService.success('正在移除所有主机资源！');
    });
  }

  shuffleSeats() {
    this.loading = true;
    this.examService.shuffleSeats(this._exam.id).subscribe(() => {
      this.msgService.success('成功重排座位！');
      this.refreshUsers();
    });
  }

  initAllExamHosts() {
    this.loading = true;
    this.examService.initAllExamHosts(this._exam.id).subscribe(() => {
      this.msgService.success('正在分配所有考生主机！');
    });
  }

  initUserHosts(userId: number) {
    this.loading = true;
    this.examService.initUserHosts(this._exam.id, userId).subscribe(() => {
      this.msgService.success('正在分配该考生的所有主机！');
    });
  }
}
