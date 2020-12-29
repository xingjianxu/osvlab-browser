import {NgModule} from '@angular/core';
import {SharedModule} from '@shared';
import {BindStudentsComponent} from './bind-students/bind-students.component';
import {EditComponent} from './edit/edit.component';
import {ListComponent} from './list/list.component';
import {StudentGroupRoutingModule} from './student-group-routing.module';
import {ViewComponent} from './view/view.component';

const COMPONENTS = [ListComponent, ViewComponent];
const COMPONENTS_NOROUNT = [EditComponent, BindStudentsComponent];

@NgModule({
  imports: [SharedModule, StudentGroupRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class StudentGroupModule {
}
