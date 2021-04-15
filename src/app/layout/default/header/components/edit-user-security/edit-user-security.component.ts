import {Component, OnInit} from '@angular/core';
import {FormProperty, PropertyGroup, SFDateWidgetSchema, SFSchema} from '@delon/form';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {UserService} from "@service/user.service";
import {NzNotificationService} from "ng-zorro-antd/notification";

@Component({
  selector: 'app-edit-user-security',
  templateUrl: './edit-user-security.component.html',
})
export class EditUserSecurityComponent implements OnInit {

  record: any = {};
  schema: SFSchema = {
    properties: {
      currentPassword: {type: 'string', title: '当前密码', ui: {type: 'password'}},
      newPassword: {
        type: 'string', title: '新密码', maxLength: 20, minLength: 6,
        ui: {
          type: 'password'
        }
      },
      newPassword2: {
        type: 'string', title: '重复新密码', maxLength: 20, minLength: 6,
        ui: {
          type: 'password',
          validator: (val, formProperty: FormProperty, form: PropertyGroup) => {
            if (form.value && form.value['newPassword'] == val) {
              return [];
            } else {
              return [{keyword: 'required', message: '与上方已输入密码不一致'}];
            }
          },
        }
      },
    },
    required: ['currentPassword', 'newPassword', 'newPassword2'],
  };

  constructor(
    private userService: UserService,
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private notificationService: NzNotificationService,
  ) {
  }

  ngOnInit(): void {
  }

  save(values: any) {
    this.userService.updatePassword(values.currentPassword, values.newPassword).subscribe((r) => {
      if (r.success) {
        this.msgSrv.success('密码更新成功');
      } else {
        this.notificationService.error('更新密码失败', r.msg);
      }
      this.modal.close(r);
    });
  }

  close() {
    this.modal.destroy();
  }

}
