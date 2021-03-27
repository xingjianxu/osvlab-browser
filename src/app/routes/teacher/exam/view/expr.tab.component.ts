import {Component, Input, OnInit} from '@angular/core';
import {Expr} from '@service/expr';
import {Exam} from '@service/exam';
import {switchMap} from 'rxjs/operators';
import {ModalHelper} from '@delon/theme';
import {AddExprsComponent} from './add-exprs/add-exprs.component';
import {ExamService} from '@service/exam.service';

@Component({
  selector: 'app-teacher-exam-view-expr-tab',
  templateUrl: './expr.tab.component.html',
})
export class ExamViewExprTabComponent implements OnInit {
  exprs: Expr[] = [];
  loading = true;

  _exam: Exam;

  @Input()
  set exam(exam: Exam) {
    if (exam.id) {
      if (exam.id == this._exam?.id) {
        return;
      }
      this.loading = true;
      this._exam = exam;
      this.examService.getExprs(exam.id).subscribe((res) => {
        this.exprs = res;
        this.loading = false;
      });
    }
  }

  constructor(private examService: ExamService, private modalHelper: ModalHelper) {
  }

  ngOnInit(): void {
  }

  addExprs() {
    this.modalHelper.create(AddExprsComponent, {exam: this._exam}, {size: 'md'}).pipe(
      switchMap((_) => {
        return this.examService.getExprs(this._exam.id);
      }),
    ).subscribe((res) => {
      this.exprs = res;
    });
  }
}
