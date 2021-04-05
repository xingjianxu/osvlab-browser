import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ModalHelper} from '@delon/theme';
import {switchMap} from 'rxjs/operators';
import {Exam} from '@service/exam';
import {ExamService} from '@service/exam.service';

@Component({
  selector: 'app-teacher-exam-view',
  templateUrl: './view.component.html',
})
export class ViewComponent implements OnInit {
  exam = new Exam();
  loading = true;

  constructor(private examService: ExamService, private modalHelper: ModalHelper, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.activatedRoute.queryParamMap.pipe(
      switchMap((params) => {
        return this.examService.findById(params.get('examId'));
      }),
    ).subscribe((exam) => {
      this.exam = exam;
      this.loading = false;
    });
  }
}
