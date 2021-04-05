import { Component, OnInit } from '@angular/core';
import { SFSchema } from '@delon/form';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ExprService } from '@service/expr.service';

@Component({
  selector: 'app-teacher-expr-edit',
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {
  record: any = {};
  schema: SFSchema = {
    properties: {
      title: { type: 'string', title: '标题', maxLength: 50 },
      description: {
        type: 'string',
        title: '描述',
        ui: {
          widget: 'textarea',
          autosize: { minRows: 3, maxRows: 6 },
        },
      },
      hostCount: { type: 'number', title: '机器数量', default: 1 },
    },
    required: ['title', 'description', 'hostCount'],
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, private exprService: ExprService) {}

  ngOnInit(): void {}

  save(values: any) {
    this.exprService.save(values).subscribe((expr) => {
      this.msgSrv.success('保存成功');
      this.modal.close(expr);
    });
  }

  close() {
    this.modal.destroy();
  }
}
