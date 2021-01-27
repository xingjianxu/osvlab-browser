import {Component, Input, OnInit} from '@angular/core';
import {ModalHelper} from '@delon/theme';
import {NzMessageService} from 'ng-zorro-antd/message';
import {switchMap} from 'rxjs/operators';
import {Exam} from '@service/exam';
import {ExamService} from '@service/exam.service';
import {AddExamineesComponent} from './add-examinees/add-examinees.component';
import {ExamineeStat} from "@service/examinee-stat";

@Component({
  selector: 'app-teacher-exam-view-examinee-tab',
  templateUrl: './examinee.tab.component.html',
})
export class ExamViewExamineeTabComponent implements OnInit {
  examineeStats: ExamineeStat[];
  loading = true;

  _exam: Exam;

  @Input()
  set exam(exam: Exam) {
    if (exam.id) {
      this.loading = true;
      this._exam = exam;
      this.examService.getExamineeStats(exam.id).subscribe((res) => {
        this.examineeStats = res;
        this.loading = false;
      });
    }
  }

  constructor(private examService: ExamService, private modalHelper: ModalHelper, private msgService: NzMessageService) {
  }

  ngOnInit(): void {
  }

  addExaminees() {
    this.modalHelper.create(AddExamineesComponent, {exam: this._exam}, {size: 'md'}).pipe(
      switchMap((_) => {
        return this.examService.getExamineeStats(this._exam.id);
      }),
    ).subscribe((res) => {
      this.examineeStats = res;
    });
  }

  removeAllExaminees() {
    this.loading = true;
    this.examService.removeAllExaminees(this._exam.id).pipe(
      switchMap((n) => {
        this.msgService.success(`成功删除${n}名学生!`);
        return this.examService.getExamineeStats(this._exam.id);
      }),
    ).subscribe((res) => {
      this.examineeStats = res;
      this.loading = false;
    });
  }
}
