import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ModalHelper} from '@delon/theme';
import {Exam} from '../../../../service/exam';
import {ExamService} from '../../../../service/exam.service';
import {EditComponent} from '../edit/edit.component';

@Component({
  selector: 'app-teacher-exam-list',
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {

  exams: Exam[];
  loading = false;

  constructor(
    private examService: ExamService,
    private modalHelper: ModalHelper,
    private cdr: ChangeDetectorRef,
  ) {

  }

  ngOnInit(): void {
    this.examService.list().subscribe((data) => {
      this.exams = data;
    });
  }

  openEditor(record): void {
    this.modalHelper.create(EditComponent, {record}, {size: 'md'}).subscribe((res) => {
      if (record.id) {
        this.exams = this.exams.map((exam) => {
          if (exam.id === res.id) {
            return res;
          } else {
            return exam;
          }
        });
      } else {
        this.exams = [res, ...this.exams];
      }
      this.cdr.detectChanges();
    });
  }

}
