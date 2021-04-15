import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ACLGuard} from '@delon/acl';
import {JWTGuard} from '@delon/auth';
import {environment} from '@env/environment';
// layout
import {LayoutDefaultComponent} from '../layout/default/default.component';
import {LayoutPassportComponent} from '../layout/passport/passport.component';
// dashboard pages
import {DashboardComponent} from './dashboard/dashboard.component';
import {UserLockComponent} from './passport/lock/lock.component';
// passport pages
import {UserLoginComponent} from './passport/login/login.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutDefaultComponent,
    canActivate: [JWTGuard],
    canActivateChild: [JWTGuard],
    children: [
      {path: '', component: DashboardComponent},
      {path: 'exception', loadChildren: () => import('./exception/exception.module').then((m) => m.ExceptionModule)},
      {
        path: 'student',
        canLoad: [JWTGuard, ACLGuard],
        data: {guard: 'student'},
        loadChildren: () => import('./student/student.module').then((m) => m.StudentModule),
      },
      {
        path: 'teacher',
        canLoad: [JWTGuard, ACLGuard],
        data: {guard: 'teacher'},
        loadChildren: () => import('./teacher/teacher.module').then((m) => m.TeacherModule),
      },
      {
        path: 'admin',
        canLoad: [JWTGuard, ACLGuard],
        data: {guard: 'admin'},
        loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule),
      },
    ],
  },
  {
    path: 'passport',
    component: LayoutPassportComponent,
    children: [
      {path: 'login', component: UserLoginComponent, data: {title: '登录', titleI18n: '登陆'}},
      {path: 'lock', component: UserLockComponent, data: {title: '锁屏', titleI18n: '锁屏'}},
    ],
  },
  // 单页不包裹Layout
  {path: '**', redirectTo: 'exception/404'},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: environment.useHash,
      // NOTICE: If you use `reuse-tab` component and turn on keepingScroll you can set to `disabled`
      // Pls refer to https://ng-alain.com/components/reuse-tab
      scrollPositionRestoration: 'top',
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class RouteRoutingModule {
}
