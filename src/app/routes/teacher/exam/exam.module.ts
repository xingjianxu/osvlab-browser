import {NgModule} from '@angular/core';
import {SharedModule} from '@shared';
import {EditComponent} from './edit/edit.component';
import {ExamRoutingModule} from './exam-routing.module';
import {ListComponent} from './list/list.component';
import {AddUsersComponent} from './view/add-users/add-users.component';
import {EditExprComponent} from './view/update-expr/edit-expr.component';
import {ExamViewUsersTabComponent} from './view/users.tab.component';
import {ExamViewExprsTabComponent} from './view/exprs.tab.component';
import {ViewComponent} from './view/view.component';
import {NzTagModule} from 'ng-zorro-antd/tag';
import {OsvlabPipeModule} from '../../../pipe/osvlab-pipe.module';
import {ScoreViewExamineeTabComponent} from "./view/score.tab.component";

const COMPONENTS = [ListComponent, ViewComponent];
const COMPONENTS_NOROUNT = [
  EditComponent,
  ExamViewExprsTabComponent,
  AddUsersComponent,
  EditExprComponent,
  ExamViewUsersTabComponent,
  ScoreViewExamineeTabComponent,
];

@NgModule({
  imports: [SharedModule, ExamRoutingModule, NzTagModule, OsvlabPipeModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT,],
  entryComponents: COMPONENTS_NOROUNT,
})
export class ExamModule {
}
