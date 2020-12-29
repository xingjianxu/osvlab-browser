import { Component, OnInit } from '@angular/core';
import { Exam } from '@service/exam';
import { ExamService } from '@service/exam.service';

@Component({
  selector: 'app-student-exam-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less'],
})
export class ListComponent implements OnInit {
  exams: Exam[];
  loading = false;

  constructor(private examService: ExamService) {}

  ngOnInit(): void {
    this.examService.listCurrentUserExams().subscribe((res) => {
      this.exams = res;
    });
  }
}
