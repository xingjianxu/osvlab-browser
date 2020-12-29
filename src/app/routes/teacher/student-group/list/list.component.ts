import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ModalHelper} from '@delon/theme';
import {UserGroup} from '../../../../service/user-group';
import {UserGroupService} from '../../../../service/user-group.service';
import {EditComponent} from '../edit/edit.component';

@Component({
  selector: 'app-admin-user-group-list',
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {

  userGroups: UserGroup[];
  loading = false;

  constructor(
    private userGroupService: UserGroupService,
    private modalHelper: ModalHelper,
    private cdr: ChangeDetectorRef,
  ) {

  }

  ngOnInit(): void {
    this.userGroupService.list().subscribe((data) => {
      this.userGroups = data;
    });
  }

  openEditor(record): void {
    this.modalHelper.create(EditComponent, {record}, {size: 'md'}).subscribe((res) => {
      if (record.id) {
        this.userGroups = this.userGroups.map((userGroup) => {
          if (userGroup.id === res.id) {
            return res;
          } else {
            return userGroup;
          }
        });
      } else {
        this.userGroups = [res, ...this.userGroups];
      }
      this.cdr.detectChanges();
    });
  }

}
