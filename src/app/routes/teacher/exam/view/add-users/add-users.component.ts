import {Component, OnInit} from '@angular/core';
import {SFSchema, SFSelectWidgetSchema} from '@delon/form';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {map} from 'rxjs/operators';
import {Exam} from '@service/exam';
import {ExamService} from '@service/exam.service';
import {UserGroupService} from '@service/user-group.service';

@Component({
  selector: 'app-teacher-exam-add-users',
  templateUrl: './add-users.component.html',
})
export class AddUsersComponent implements OnInit {
  exam: Exam;

  saveLoading = false;

  schema: SFSchema = {
    properties: {
      students: {
        type: 'string',
        title: '学生列表',
        ui: {
          widget: 'textarea',
          placeholder: '学号1\n学号2\n... ...',
          autosize: {minRows: 10},
        },
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
    const usernames = values.students.split('\n').map((s) => s.trim()).filter((e) => e && e.length > 0);
    this.examService.addUsers(this.exam.id, usernames).subscribe((res) => {
      this.msgSrv.success('成功添加学生：' + res.toString());
      this.saveLoading = false;
      this.close(res);
    });
  }

  close(r) {
    this.modal.destroy(r);
  }
}
