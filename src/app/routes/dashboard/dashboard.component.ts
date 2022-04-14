import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ACLService } from '@delon/acl';

@Component({
  selector: 'app-dashboard',
  template: ''
})
export class DashboardComponent {
  constructor(private router: Router, private aclService: ACLService) {
    if (this.aclService.can('teacher')) {
      this.router.navigate(['teacher']);
    } else if (this.aclService.can('admin')) {
      this.router.navigate(['admin']);
    } else if (this.aclService.can('student')) {
      this.router.navigate(['student']);
    }
  }
}
