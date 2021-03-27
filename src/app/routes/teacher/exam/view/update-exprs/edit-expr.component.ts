import {Component, OnInit} from '@angular/core';
import {SFSchema, SFSelectWidgetSchema} from '@delon/form';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {filter, map} from 'rxjs/operators';
import {ExprService} from '@service/expr.service';
import {Exam} from '@service/exam';
import {ExamService} from '@service/exam.service';
import {of} from "rxjs";

@Component({
  selector: 'app-teacher-exam-edit-expr',
  templateUrl: './edit-expr.component.html',
})
export class EditExprComponent implements OnInit {
  exam: Exam;
  record = {};

  saveLoading = false;

  schema: SFSchema = {
    properties: {
      exprId: {
        type: 'number',
        title: '实验',
        ui: {
          widget: 'select',
          asyncData: () => {
            if (this.record['id']) {
              return of([{label: this.record['expr'].title, value: this.record['expr'].id}]);
            } else {
              return this.exprService.list().pipe(map((exprs) => {
                return exprs.filter((expr) => {
                  return !this.exam.exprs.find((e) => {
                    return e.id == expr.id;
                  });
                }).map((expr) => {
                  return {label: expr.title, value: expr.id};
                })
              }));
            }
          },
        } as SFSelectWidgetSchema,
      },
      vmIdPrefix: {
        type: 'number',
        title: '虚拟机ID前缀',
      },
      rank: {
        type: 'number',
        title: '排序',
      },
    },
    required: ['exprId', 'vmIdPrefix', 'rank'],
    ui: {
      spanLabelFixed: 120,
      grid: {span: 24},
    },
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private exprService: ExprService,
    private examService: ExamService,
  ) {
  }

  ngOnInit(): void {
  }

  save(values: any) {
    this.saveLoading = true;
    this.examService.updateExpr(this.exam.id, values.exprId, values.vmIdPrefix, values.rank).subscribe(() => {
      this.saveLoading = false;
      if (this.record['id']) {
        this.msgSrv.success('修改成功!');
      } else {
        this.msgSrv.success('添加成功!');
      }
      this.close(true);
    });
  }

  close(r) {
    this.modal.destroy(r);
  }
}
