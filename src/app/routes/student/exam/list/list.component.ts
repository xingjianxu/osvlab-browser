import { Component, OnInit } from '@angular/core';
import { Exam } from '@service/exam';
import { ExamService } from '@service/exam.service';
import {ExamUserLink} from "@service/exam-user-link";

@Component({
  selector: 'app-student-exam-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less'],
})
export class ListComponent implements OnInit {
  examUserLinks: ExamUserLink[];
  loading = false;

  constructor(private examService: ExamService) {}

  ngOnInit(): void {
    this.examService.listCurrentUserExams().subscribe((r) => {
      if (r.success) {
        this.examUserLinks = r.data;
      }
    });
  }
}
