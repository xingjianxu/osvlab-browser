import { Component, OnInit } from '@angular/core';
import { SFSchema } from '@delon/form';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { UserGroupService } from '../../../../service/user-group.service';

@Component({
  selector: 'app-admin-user-group-edit',
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {
  record: any = {};
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '名字', maxLength: 50 },
      description: {
        type: 'string',
        title: '描述',
        ui: {
          widget: 'textarea',
          autosize: { minRows: 3, maxRows: 6 },
        },
      },
    },
    required: ['name'],
    ui: {
      spanLabelFixed: 80,
      grid: { span: 24 },
    },
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, private userGroupService: UserGroupService) {}

  ngOnInit(): void {}

  save(values: any) {
    this.userGroupService.save(values).subscribe((expr) => {
      this.msgSrv.success('保存成功');
      this.modal.close(expr);
    });
  }

  close() {
    this.modal.destroy();
  }
}
