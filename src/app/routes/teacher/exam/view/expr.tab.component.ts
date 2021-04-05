import {Component, Input, OnInit} from '@angular/core';
import {Expr} from '@service/expr';
import {Exam} from '@service/exam';
import {switchMap} from 'rxjs/operators';
import {ModalHelper} from '@delon/theme';
import {EditExprComponent} from './update-expr/edit-expr.component';
import {ExamService} from '@service/exam.service';
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'app-teacher-exam-view-expr-tab',
  templateUrl: './expr.tab.component.html',
})
export class ExamViewExprTabComponent implements OnInit {
  loading = true;

  _exam: Exam;

  @Input()
  set exam(exam: Exam) {
    if (exam.id) {
      if (exam.id == this._exam?.id) {
        return;
      }
      this._exam = exam;
    }
    this.loading = false;
  }

  constructor(
    private examService: ExamService,
    private modalHelper: ModalHelper,
    private messageService: NzMessageService) {
  }

  ngOnInit(): void {
  }

  addExpr() {
    this.updateExam(this.modalHelper.create(EditExprComponent, {exam: this._exam}, {size: 'md'}));
  }

  updateExpr(e) {
    this.updateExam(this.modalHelper.create(EditExprComponent, {exam: this._exam, record: {exprId: e.expr.id, ...e}}, {size: 'md'}));
  }

  removeExpr(exprId: number | string) {
    this.updateExam(this.examService.removeExpr(this._exam.id, exprId), '删除成功！');
  }

  private updateExam(o, msg=undefined) {
    o.pipe(switchMap((_) => {
      this.loading = true;
      if (msg) {
        this.messageService.success(msg);
      }
      return this.examService.findById(this._exam.id);
    })).subscribe((exam) => {
      this._exam = exam;
      this.loading = false;
    });
  }
}
