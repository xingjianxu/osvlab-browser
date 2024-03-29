import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SFNumberWidgetSchema, SFSchema } from '@delon/form';
import { ExprService } from '@service/expr.service';
import { StepService } from '@service/step.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-teacher-expr-step-edit',
  templateUrl: './edit.component.html'
})
export class StepEditComponent implements OnInit {
  step: any;

  schema: SFSchema = {
    properties: {
      title: {
        type: 'string',
        title: '标题',
        maxLength: 50
      },
      description: {
        type: 'string',
        title: '描述',
        ui: {
          widget: 'textarea',
          autosize: { minRows: 5, maxRows: 7 }
        }
      },
      fullScore: {
        type: 'number',
        title: '满分',
        minimum: 1,
        default: 1,
        ui: {
          grid: {
            span: 3
          }
        }
      },
      hostId: {
        type: 'number',
        title: '主机',
        default: 1,
        minimum: 1,
        ui: {
          prefix: 'host',
          grid: {
            span: 3
          }
        } as SFNumberWidgetSchema
      },
      scoreScript: {
        type: 'string',
        title: '判分程序',
        ui: {
          widget: 'code',
          editorOption: {
            language: 'python',
            dimension: { height: 400 }
          }
        }
      },
      refOpts: {
        type: 'string',
        title: '参考答案',
        ui: {
          widget: 'code',
          editorOption: {
            language: 'shell',
            dimension: { height: 400 }
          }
        }
      }
    },
    required: ['title', 'description', 'fullScore', 'scoreScript', 'hostId'],
    ui: {
      spanLabelFixed: 80,
      width: 800,
      grid: {
        span: 24
      }
    }
  };

  constructor(
    private msgSrv: NzMessageService,
    private stepSerice: StepService,
    private exprService: ExprService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParamMap
      .pipe(
        switchMap(params => {
          if (params.has('stepId')) {
            const stepId = params.get('stepId');
            return this.stepSerice.find(stepId);
          } else {
            return this.exprService.get(params.get('exprId')).pipe(
              switchMap(expr => {
                return of({ exprId: expr.id, expr });
              })
            );
          }
        })
      )
      .subscribe(step => {
        this.step = step;
        this.schema.properties.hostId.maximum = this.step.expr.hostCount;
      });
  }

  save(values: any) {
    this.stepSerice.save({ ...values }).subscribe(step => {
      this.msgSrv.success('保存成功');
      //成功新建step后，跳转到其编辑页面
      if (this.step.id != step.id) {
        this.router.navigate(['.'], { queryParams: { stepId: step.id }, relativeTo: this.activatedRoute });
      }
    });
  }
}
