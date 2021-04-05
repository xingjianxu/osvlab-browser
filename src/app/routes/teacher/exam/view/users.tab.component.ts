import {Component, Input, OnInit} from '@angular/core';
import {ModalHelper} from '@delon/theme';
import {NzMessageService} from 'ng-zorro-antd/message';
import {switchMap} from 'rxjs/operators';
import {Exam} from '@service/exam';
import {ExamService} from '@service/exam.service';
import {AddUsersComponent} from './add-users/add-users.component';
import {ExamUserLink} from "@service/exam-user-link";

@Component({
  selector: 'app-teacher-exam-view-users-tab',
  templateUrl: './users.tab.component.html',
})
export class ExamViewUsersTabComponent implements OnInit {
  examUserLinks: ExamUserLink[];
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
      this.examService.getExamUserLinks(exam.id).subscribe((res) => {
        this.examUserLinks = res;
        this.loading = false;
      });
    }
  }

  constructor(private examService: ExamService, private modalHelper: ModalHelper, private msgService: NzMessageService) {
  }

  ngOnInit(): void {
  }

  addUsers() {
    this.modalHelper.create(AddUsersComponent, {exam: this._exam}, {size: 'md'}).pipe(
      switchMap((_) => {
        return this.examService.getExamUserLinks(this._exam.id);
      }),
    ).subscribe((res) => {
      this.examUserLinks = res;
    });
  }

  removeAllUsers() {
    this.loading = true;
    this.examService.removeAllUsers(this._exam.id).pipe(
      switchMap((r) => {
        if (r.success) {
          this.msgService.success('成功删除所有考试学生!');
          return this.examService.getExamUserLinks(this._exam.id);
        } else {
          this.msgService.success('发生未知错误！');
        }
      }),
    ).subscribe((res) => {
      this.examUserLinks = res;
      this.loading = false;
    });
  }
}