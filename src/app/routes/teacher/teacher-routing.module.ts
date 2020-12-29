import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutTeacherComponent } from './layout-teacher.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutTeacherComponent,
    children: [
      { path: '', redirectTo: 'expr', pathMatch: 'full' },
      { path: 'exam', loadChildren: () => import('./exam/exam.module').then((m) => m.ExamModule) },
      { path: 'expr', loadChildren: () => import('./expr/expr.module').then((m) => m.ExprModule) },
      { path: 'student-group', loadChildren: () => import('./student-group/student-group.module').then((m) => m.StudentGroupModule) },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeacherRoutingModule {}
