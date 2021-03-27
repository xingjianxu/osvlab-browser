import {NgModule} from '@angular/core';
import {SharedModule} from '@shared';
import {EditComponent} from './edit/edit.component';
import {ExamRoutingModule} from './exam-routing.module';
import {ListComponent} from './list/list.component';
import {AddExamineesComponent} from './view/add-examinees/add-examinees.component';
import {EditExprComponent} from './view/update-exprs/edit-expr.component';
import {ExamViewExamineeTabComponent} from './view/examinee.tab.component';
import {ExamViewExprTabComponent} from './view/expr.tab.component';
import {ViewComponent} from './view/view.component';
import {NzTagModule} from 'ng-zorro-antd/tag';
import {OsvlabPipeModule} from '../../../pipe/osvlab-pipe.module';
import {ScoreViewExamineeTabComponent} from "./view/score.tab.component";

const COMPONENTS = [ListComponent, ViewComponent];
const COMPONENTS_NOROUNT = [
  EditComponent,
  ExamViewExprTabComponent,
  AddExamineesComponent,
  EditExprComponent,
  ExamViewExamineeTabComponent,
  ScoreViewExamineeTabComponent,
];

@NgModule({
  imports: [SharedModule, ExamRoutingModule, NzTagModule, OsvlabPipeModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT,],
  entryComponents: COMPONENTS_NOROUNT,
})
export class ExamModule {
}
