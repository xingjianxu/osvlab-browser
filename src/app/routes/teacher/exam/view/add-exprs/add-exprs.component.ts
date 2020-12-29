import { Component, OnInit } from '@angular/core';
import { SFSchema, SFSelectWidgetSchema } from '@delon/form';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { filter, map } from 'rxjs/operators';
import { ExprService } from '../../../../../service/expr.service';
import { Exam } from '../../../../../service/exam';
import { ExamService } from '../../../../../service/exam.service';

@Component({
  selector: 'app-teacher-exam-add-exprs',
  templateUrl: './add-exprs.component.html',
})
export class AddExprsComponent implements OnInit {
  exam: Exam;

  saveLoading = false;

  schema: SFSchema = {
    properties: {
      exprIds: {
        type: 'number',
        title: '实验',
        ui: {
          widget: 'select',
          mode: 'multiple',
          asyncData: () =>
            this.exprService.list().pipe(
              map((exprs) => {
                return exprs
                  .filter((expr) => {
                    return !this.exam.exprs.find((e) => {
                      return e.id == expr.id;
                    });
                  })
                  .map((expr) => {
                    return { label: `${expr.title}`, value: expr.id };
                  });
              }),
            ),
        } as SFSelectWidgetSchema,
      },
    },
    required: ['exprIds'],
    ui: {
      spanLabelFixed: 80,
      grid: { span: 24 },
    },
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private exprService: ExprService,
    private examService: ExamService,
  ) {}

  ngOnInit(): void {}

  save(values: any) {
    this.saveLoading = true;
    const exprIds = values.exprIds;
    this.examService.addExprs(this.exam.id, exprIds).subscribe((res) => {
      this.msgSrv.success('成功添加实验：' + res.toString());
      this.saveLoading = false;
      this.close(res);
    });
  }

  close(r) {
    this.modal.destroy(r);
  }
}
