import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ModalHelper } from '@delon/theme';
import { switchMap } from 'rxjs/operators';
import { Expr } from '../../../../service/expr';
import { ExprService } from '../../../../service/expr.service';
import { EditComponent } from '../edit/edit.component';

@Component({
  selector: 'app-teacher-expr-list',
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {
  exprs: Expr[];
  exprTableLoading = false;

  constructor(private exprService: ExprService, private modalHelper: ModalHelper, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.exprTableLoading = true;
    this.exprService.list().subscribe((data) => {
      this.exprTableLoading = false;
      this.exprs = data;
    });
  }

  openEditor(record): void {
    this.modalHelper.create(EditComponent, { record }, { size: 'md' }).subscribe((res) => {
      if (record.id) {
        this.exprs = this.exprs.map((expr) => {
          if (expr.id === res.id) {
            return res;
          } else {
            return expr;
          }
        });
      } else {
        this.exprs = [res, ...this.exprs];
      }
      this.cdr.detectChanges();
    });
  }
}
