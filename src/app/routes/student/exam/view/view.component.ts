import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Exam} from '@service/exam';
import {ExamService} from '@service/exam.service';
import {Expr} from '@service/expr';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-student-exam-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.less'],
})
export class ViewComponent implements OnInit {
  exam: Exam;
  exprs: Expr[];
  examLoading = true;
  exprsLoading = true;

  constructor(private examService: ExamService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.examLoading = true;
    this.activatedRoute.queryParamMap.pipe(switchMap((queryMap) => {
      return this.examService.get(queryMap.get('examId'));
    })).subscribe((resp) => {
      this.exam = resp;
      this.examLoading = false;
    });

    this.exprsLoading = true;
    this.activatedRoute.queryParamMap.pipe(switchMap((queryMap) => {
      return this.examService.getExprs(queryMap.get('examId'));
    })).subscribe((resp) => {
      this.exprs = resp;
      this.exprsLoading = false;
    });
  }
}
