import { Component, OnInit } from '@angular/core';
import { SFSchema } from '@delon/form';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { User } from '../../../../service/user';
import { UserGroupService } from '../../../../service/user-group.service';

@Component({
  selector: 'app-admin-user-group-bind-students',
  templateUrl: './bind-students.component.html',
})
export class BindStudentsComponent implements OnInit {
  student_group_id: number;

  schema: SFSchema = {
    properties: {
      students: {
        type: 'string',
        title: '学生列表',
        ui: {
          widget: 'textarea',
          placeholder: '学号1 姓名1\n学号2 姓名3\n... ...',
          autosize: { minRows: 10 },
        },
      },
    },
    required: ['students'],
    ui: {
      spanLabelFixed: 80,
      grid: { span: 24 },
    },
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, private userGroupService: UserGroupService) {}

  ngOnInit(): void {}

  save(values: any) {
    const students = values.students.split('\n').map((line) => {
      const user = new User();
      [user.username, user.fullName] = line.split(/\s+/);
      return user;
    });
    this.userGroupService.bindUsers(this.student_group_id, students).subscribe((res) => {
      this.msgSrv.success('成功绑定学生数：' + res.length);
      this.close(res);
    });
  }

  close(res) {
    this.modal.destroy(res);
  }
}
