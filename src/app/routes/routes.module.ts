import { NgModule } from '@angular/core';

import { SharedModule } from '@shared';
// single pages
import { CallbackComponent } from './callback/callback.component';
// dashboard pages
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserLockComponent } from './passport/lock/lock.component';
// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { RouteRoutingModule } from './routes-routing.module';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';

const COMPONENTS = [
  DashboardComponent,
  // passport pages
  UserLoginComponent,
  // single pages
  CallbackComponent,
  UserLockComponent,
];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, RouteRoutingModule, StudentModule, TeacherModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
})
export class RoutesModule {}
