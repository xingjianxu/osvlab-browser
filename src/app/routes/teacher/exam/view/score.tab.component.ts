import {Component, Input, OnInit} from '@angular/core';
import {ModalHelper} from '@delon/theme';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Exam} from '@service/exam';
import {ExamService} from '@service/exam.service';
import {User} from '@service/user';
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

  get failCount() {
    const thr = this._exam.fullScore * 0.6;
    return this.scoreStats.filter(s => s.score < thr).length;
  }

  get fullmarkCount() {
    return this.scoreStats.filter(s => s.score >= this._exam.fullScore).length;
  }

  get avgScore() {
    return (this.scoreStats.reduce((acc, cur) => acc + cur.score, 0) / this.scoreStats.length).toFixed(2);
  }

  @Input()
  set exam(exam: Exam) {
    if (exam.id) {
      // Maybe a bug of Angular
      if (exam.id == this._exam?.id) {
        return;
      }
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

}
