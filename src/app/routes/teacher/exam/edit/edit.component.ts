import {Component, OnInit} from '@angular/core';
import {SFDateWidgetSchema, SFSchema} from '@delon/form';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {ExamService} from '@service/exam.service';

@Component({
  selector: 'app-teacher-exam-edit',
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {

  record: any = {};
  schema: SFSchema = {
    properties: {
      title: {type: 'string', title: '标题', maxLength: 50},
      description: {
        type: 'string',
        title: '描述',
        ui: {
          widget: 'textarea',
          autosize: {minRows: 3, maxRows: 6},
        },
      },
      startedAt: {
        type: 'string',
        title: '起止时间',
        ui: {widget: 'date', end: 'endedAt', showTime: true, showToday: true, format: 'yyyy-MM-dd\'T\'HH:mm:ss'} as SFDateWidgetSchema,
      },
      endedAt: {
        type: 'string',
      },
    },
    required: ['title', 'description', 'startedAt'],
    ui: {
      spanLabelFixed: 80,
      grid: {span: 24},
    },
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private examService: ExamService,
  ) {
  }

  ngOnInit(): void {
  }

  save(values: any) {
    this.examService.save(values).subscribe((expr) => {
      this.msgSrv.success('保存成功');
      this.modal.close(expr);
    });
  }

  close() {
    this.modal.destroy();
  }

}
