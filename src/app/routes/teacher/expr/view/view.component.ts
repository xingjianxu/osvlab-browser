import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ModalHelper} from '@delon/theme';
import {switchMap} from 'rxjs/operators';
import {Expr} from '@service/expr';
import {ExprService} from '@service/expr.service';

@Component({
  selector: 'app-teacher-expr-view',
  templateUrl: './view.component.html',
  styles: [
    `
        ::ng-deep .cdk-drag-handle {
            cursor: grabbing;
        }

        ::ng-deep .cdk-drag-preview {
            display: table;
        }

        ::ng-deep .cdk-drag-placeholder {
            opacity: 0;
        }
    `,
  ],
})
export class ViewComponent implements OnInit {
  expr: Expr = new Expr();
  loading = false;

  constructor(private exprService: ExprService, private modalHelper: ModalHelper, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.pipe(
      switchMap((params) => {
        return this.exprService.get(params.get('exprId'));
      }),
    ).subscribe((expr) => {
      this.expr = expr;
    });
  }

  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousIndex === event.currentIndex) {
      return;
    }
    const steps = [...this.expr.steps];
    moveItemInArray(steps, event.previousIndex, event.currentIndex);
    this.exprService.saveStepsOrder(
      steps.map((step) => {
        return step.id;
      }),
    ).subscribe(() => {
      this.expr.steps = steps;
    });
  }
}
