import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { App, SettingsService } from '@delon/theme';
import { ACLService } from '@delon/acl';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  role: string;

  get app(): App {
    return this.settings.app;
  }

  get collapsed(): boolean {
    return this.settings.layout.collapsed;
  }

  constructor(private settings: SettingsService, private router: Router, private cdr: ChangeDetectorRef) {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (val.url.startsWith('/teacher')) {
          this.role = '教师';
        } else if (val.url.startsWith('/student')) {
          this.role = '学生';
        } else if (val.url.startsWith('/admin')) {
          this.role = '管理员';
        }
        this.cdr.detectChanges();
      }
    });
  }

  ngOnInit(): void {}
}
