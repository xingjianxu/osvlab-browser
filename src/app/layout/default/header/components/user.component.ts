import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {Router} from '@angular/router';
import {DA_SERVICE_TOKEN, ITokenService} from '@delon/auth';
import {ModalHelper, SettingsService, User} from '@delon/theme';
import {EditUserProfileComponent} from "./edit-user-profile/edit-user-profile.component";

@Component({
  selector: 'header-user',
  template: `
    <div class="alain-default__nav-item d-flex align-items-center px-sm" nz-dropdown nzPlacement="bottomRight" [nzDropdownMenu]="userMenu">
      当前用户: {{ user.name }}
    </div>
    <nz-dropdown-menu #userMenu="nzDropdownMenu">
      <div nz-menu class="width-sm">
        <div nz-menu-item (click)="openUserProfileEditor()">
          <i nz-icon nzType="profile" nzTheme="outline" class="mr-sm"></i>
          个人信息维护
        </div>
        <li nz-menu-divider></li>
        <div nz-menu-item (click)="logout()">
          <i nz-icon nzType="logout" class="mr-sm"></i>
          退出登录
        </div>
      </div>
    </nz-dropdown-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderUserComponent {
  get user(): User {
    return this.settings.user;
  }

  constructor(
    private settings: SettingsService,
    private router: Router,
    private modalHelper: ModalHelper,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,) {
  }

  logout() {
    this.tokenService.clear();
    this.router.navigateByUrl(this.tokenService.login_url);
  }

  openUserProfileEditor() {
    this.modalHelper.createStatic(EditUserProfileComponent,
      {record: this.user},
      {size: 'md'}
    ).subscribe((r) => {
      if (r.success) {
        this.logout();
      }
    });
  }
}
