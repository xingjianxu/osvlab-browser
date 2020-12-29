import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ModalHelper, User} from '@delon/theme';
import {switchMap} from 'rxjs/operators';
import {UserGroup} from '../../../../service/user-group';
import {UserGroupService} from '../../../../service/user-group.service';
import {BindStudentsComponent} from '../bind-students/bind-students.component';
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'app-admin-student-group-view',
  templateUrl: './view.component.html'
})
export class ViewComponent implements OnInit {

  studentGroup = new UserGroup();
  loading = false;
  students: User[] = [];

  constructor(
    private userGroupService: UserGroupService,
    private modalHelper: ModalHelper,
    private activatedRoute: ActivatedRoute,
    private msgService: NzMessageService,
  ) {
  }

  ngOnInit(): void {
    this.initStudentGroup();
    this.initStudents();
  }

  initStudentGroup() {
    this.activatedRoute.queryParamMap.pipe(switchMap((params) => {
      return this.userGroupService.get(params.get('student_group_id'));
    })).subscribe((studentGroup) => {
      this.studentGroup = studentGroup;
    });
  }

  initStudents() {
    this.activatedRoute.queryParamMap.pipe(switchMap((params) => {
      return this.userGroupService.getUsers(params.get('student_group_id'));
    })).subscribe((students) => {
      this.students = students;
    });
  }

  openBindStudentsEditor(): void {
    this.modalHelper.create(BindStudentsComponent, {student_group_id: this.studentGroup.id}, {size: 'md'}).pipe(switchMap((resp) => {
      return this.userGroupService.getUsers(this.studentGroup.id);
    })).subscribe((students) => {
      this.students = students;
    });
  }

  unbind(studentsIds: number[]) {
    this.userGroupService.unbindUsers(this.studentGroup.id, studentsIds).pipe(switchMap((num) => {
      this.msgService.success(`成功移除${num}名学生`);
      return this.userGroupService.getUsers(this.studentGroup.id);
    })).subscribe((students) => {
      this.students = students;
    });
  }
}

