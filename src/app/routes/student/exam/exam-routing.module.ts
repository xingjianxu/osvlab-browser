import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ListComponent} from './list/list.component';
import {ViewComponent} from './view/view.component';

const routes: Routes = [
  {path: 'list', component: ListComponent},
  {path: 'view', component: ViewComponent},
  {path: 'expr', loadChildren: () => import('./expr/expr.module').then(m => m.ExprModule)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExamRoutingModule {
}
