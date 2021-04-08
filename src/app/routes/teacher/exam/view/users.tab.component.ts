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
    this.pveService.initUserHost(userId, this._exam.id, exprId, hostId).subscribe();
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
    this.examService.removeUsers(this._exam.id, userIds).subscribe((r) => {
      if (r.success) {
        this.msgService.success('成功移除该学生！');
        this.refreshUsers();
      }
    });
  }
}
