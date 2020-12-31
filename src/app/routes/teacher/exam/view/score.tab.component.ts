import {Component, Input, OnInit} from '@angular/core';
import {ModalHelper} from '@delon/theme';
import {NzMessageService} from 'ng-zorro-antd/message';
import {switchMap} from 'rxjs/operators';
import {Exam} from '@service/exam';
import {ExamService} from '@service/exam.service';
import {User} from '@service/user';
import {AddExamineesComponent} from './add-examinees/add-examinees.component';
import {combineLatest} from "rxjs";
import {ScoreStat} from "@service/score-stat";

@Component({
  selector: 'app-teacher-exam-view-score-tab',
  templateUrl: './score.tab.component.html',
})
export class ScoreViewExamineeTabComponent implements OnInit {
  examinees: User[];
  scoreStats: ScoreStat[];
  loading = true;

  _exam: Exam;

  @Input()
  set exam(exam: Exam) {
    if (exam.id) {
      this.loading = true;
      this._exam = exam;
      combineLatest([
        this.examService.scoreStats(exam.id),
        this.examService.getExaminees(exam.id)
      ]).subscribe(([scoreStats, examinees]) => {
        this.scoreStats = scoreStats;
        this.examinees = examinees;
        this.loading = false;
      })
    }
  }

  constructor(private examService: ExamService, private modalHelper: ModalHelper, private msgService: NzMessageService) {
  }

  ngOnInit(): void {
  }

  addExaminees() {
    this.modalHelper.create(
      AddExamineesComponent, {exam: this._exam}, {size: 'md'}
    ).pipe(switchMap((_) => {
      return this.examService.getExaminees(this._exam.id);
    })).subscribe((res) => {
      this.examinees = res;
    });
  }

  removeAllExaminees() {
    this.loading = true;
    this.examService
      .removeAllExaminees(this._exam.id)
      .pipe(
        switchMap((n) => {
          this.msgService.success(`成功删除${n}名学生!`);
          return this.examService.getExaminees(this._exam.id);
        }),
      )
      .subscribe((res) => {
        this.examinees = res;
        this.loading = false;
      });
  }
}
