import { Inject, Injectable, Injector } from '@angular/core';
import { ACLService } from '@delon/acl';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { MenuService, SettingsService, TitleService } from '@delon/theme';
import { environment } from '@env/environment';
import { UserService } from '@service/user.service';
import { StompRService } from '@stomp/ng2-stompjs';
import { NzIconService } from 'ng-zorro-antd/icon';

import { ICONS } from '../../../style-icons';
import { ICONS_AUTO } from '../../../style-icons-auto';

/**
 * Used for application startup
 * Generally used to get the basic data of the application, like: Menu Data, User Data, etc.
 */
@Injectable()
export class StartupService {
  constructor(
    iconSrv: NzIconService,
    private userService: UserService,
    private menuService: MenuService,
    private settingService: SettingsService,
    private aclService: ACLService,
    private titleService: TitleService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private stompRService: StompRService
  ) {
    iconSrv.addIcon(...ICONS_AUTO, ...ICONS);
    iconSrv.fetchFromIconfont({
      scriptUrl: `${environment.serverUrl}/assets/iconfont.js`
    });
  }

  private initStomp(token: { name: string; value: string }) {
    this.stompRService.config = {
      url: `ws://${environment.apiRootUrl}/ws/stomp`,
      headers: {
        [token.name]: token.value
      },
      heartbeat_in: 2000, // Typical value 0 - disabled
      heartbeat_out: 2000, // Typical value 20000 - every 20 seconds
      reconnect_delay: 2000,
      debug: false
    };
    this.stompRService.initAndConnect();
  }

  load(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.settingService.setApp({
        name: 'OSVLab',
        description: '操作系统虚拟化实验室'
      });
      this.titleService.suffix = this.settingService.app.name;
      const user = this.tokenService.get();
      if (!user.id) {
        resolve({});
        return;
      }
      this.settingService.setUser({
        name: user.fullName,
        email: user.email
      });
      this.aclService.setRole(user.roles);
      //this.initStomp(user.token as unknown as { name: string; value: string });
      resolve({});
    });
  }
}
