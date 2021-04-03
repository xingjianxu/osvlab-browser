import {Component, OnInit} from '@angular/core';
import {SFNumberWidgetSchema, SFSchema} from '@delon/form';
import {NzMessageService} from 'ng-zorro-antd/message';
import {StepService} from '../../../../../service/step.service';
import {ActivatedRoute, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {ExprService} from '../../../../../service/expr.service';

@Component({
  selector: 'app-teacher-expr-step-edit',
  templateUrl: './edit.component.html',
})
export class StepEditComponent implements OnInit {
  record: any;

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
      fullScore: {
        type: 'number',
        title: '满分',
      },
      hostId: {
        type: 'number',
        title: '主机',
        default: 1,
        minimum: 1,
        ui: {
          prefix: 'host',
        } as SFNumberWidgetSchema,
      },
      scoreScript: {
        type: 'string',
        title: '判分程序',
        ui: {
          widget: 'code',
          editorOption: {
            language: 'python',
            dimension: {height: 400}
          },
        },
      },
      refOpts: {
        type: 'string',
        title: '参考答案',
        ui: {
          widget: 'code',
          editorOption: {
            language: 'shell',
            dimension: {height: 400}
          },
        },
      },
    },
    required: ['title', 'description', 'fullScore', 'scoreScript', 'hostname'],
    ui: {
      spanLabelFixed: 80,
      width: 800,
    },
  };

  constructor(
    private msgSrv: NzMessageService,
    private stepSerice: StepService,
    private exprService: ExprService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.pipe(
      switchMap((params) => {
        if (params.has('stepId')) {
          const stepId = params.get('stepId');
          return this.stepSerice.find(stepId);
        } else {
          return this.exprService.get(params.get('exprId')).pipe(
            switchMap((expr) => {
              return of({exprId: expr.id, expr});
            }),
          );
        }
      }),
    ).subscribe((step) => {
      this.record = step;
    });
  }

  save(values: any) {
    this.stepSerice.save({...values}).subscribe((step) => {
      this.msgSrv.success('保存成功');
      //成功新建step后，跳转到其编辑页面
      if (this.record.id != step.id) {
        this.router.navigate(['.'], {queryParams: {stepId: step.id}, relativeTo: this.activatedRoute});
      }
    });
  }
}
