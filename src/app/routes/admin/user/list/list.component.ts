import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ModalHelper} from '@delon/theme';
import {User} from '../../../../service/user';
import {UserService} from '../../../../service/user.service';

@Component({
  selector: 'app-admin-user-list',
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {

  users: User[];
  loading = false;

  constructor(
    private userService: UserService,
    private modalHelper: ModalHelper,
    private cdr: ChangeDetectorRef,
  ) {

  }

  ngOnInit(): void {
    this.userService.list().subscribe((data) => {
      this.users = data;
    });
  }

}
