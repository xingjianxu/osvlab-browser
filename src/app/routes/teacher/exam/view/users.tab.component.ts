import {Component, Input, OnInit} from '@angular/core';
import {ModalHelper} from '@delon/theme';
import {NzMessageService} from 'ng-zorro-antd/message';
import {switchMap} from 'rxjs/operators';
import {Exam} from '@service/exam';
import {ExamService} from '@service/exam.service';
import {AddUserGroupsComponent} from './add-user-group/add-user-groups.component';
import {ExamUserLink} from "@service/exam-user-link";
import {PveService} from "@service/pve.service";
import {Expr} from "@service/expr";
import {combineLatest} from "rxjs";
import {ExamUserHost} from "@service/exam-user-host";
import {NzModalService} from "ng-zorro-antd/modal";
import {AddUsersComponent} from "./add-users/add-users.component";

@Component({
  selector: 'app-teacher-exam-view-users-tab',
  templateUrl: './users.tab.component.html',
})
export class ExamViewUsersTabComponent implements OnInit {
  examUserLinks: ExamUserLink[];
  loading = true;

  _exam: Exam;
  exprs: Expr[];
  userHostsMapping: { string: ExamUserHost };

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
    private modal: NzModalService,
    private msgService: NzMessageService) {
  }

  ngOnInit(): void {
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
    this.pveService.initUserHost(userId, this._exam.id, exprId, hostId).subscribe(() => {
      this.refreshUsers();
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
      if (r.success) {
        this.msgService.success('成功移除该学生！');
        this.refreshUsers();
      }
    });
  }

  lockUserInExam() {
  }

  deleteAllExamHosts() {
    this.loading = true;
    this.pveService.deleteAllExamHosts(this._exam.id).subscribe(() => {
      this.msgService.success('成功移除所有主机资源！');
      this.refreshUsers();
    });
  }

  shuffleSeats() {
    this.loading = true;
    this.examService.shuffleSeats(this._exam.id).subscribe(() => {
      this.msgService.success('成功重排座位！');
      this.refreshUsers();
    });
  }

  initAllUserHosts() {
    this.loading = true;
    this.examService.initAllUserHosts(this._exam.id).subscribe(() => {
      this.msgService.success('完成所有考生主机的分配！');
      this.refreshUsers();
    });
  }

  initUserHosts(userId: number) {
    this.loading = true;
    this.examService.initUserHosts(this._exam.id, userId).subscribe(() => {
      this.msgService.success('完成该考生主机的分配！');
      this.refreshUsers();
    });
  }
}
