import {Component, OnInit} from '@angular/core';
import {SFSchema, SFSelectWidgetSchema} from '@delon/form';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {map} from 'rxjs/operators';
import {Exam} from '@service/exam';
import {ExamService} from '@service/exam.service';
import {UserGroupService} from '@service/user-group.service';

@Component({
  selector: 'app-teacher-exam-add-user-groupss',
  templateUrl: './add-user-groups.component.html',
})
export class AddUserGroupsComponent implements OnInit {
  exam: Exam;

  saveLoading = false;

  schema: SFSchema = {
    properties: {
      userGroupIds: {
        type: 'number',
        title: '学生组',
        ui: {
          widget: 'select',
          mode: 'multiple',
          asyncData: () =>
            this.userGroupService.list().pipe(
              map((groups) => {
                return groups.map((group) => {
                  return {label: `${group.name} (${group.usersCount})`, value: group.id};
                });
              }),
            ),
        } as SFSelectWidgetSchema,
      },
    },
    required: ['userGroupIds'],
    ui: {
      spanLabelFixed: 80,
      grid: {span: 24},
    },
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private userGroupService: UserGroupService,
    private examService: ExamService,
  ) {
  }

  ngOnInit(): void {
  }

  save(values: any) {
    this.saveLoading = true;
    const userGroupIds = values.userGroupIds;
    this.examService.addUserGroups(this.exam.id, userGroupIds).subscribe((res) => {
      this.msgSrv.success('成功添加学生：' + res.toString());
      this.saveLoading = false;
      this.close(res);
    });
  }

  close(r) {
    this.modal.destroy(r);
  }
}
