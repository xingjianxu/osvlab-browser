import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { EditComponent } from './edit/edit.component';
import { ExprRoutingModule } from './expr-routing.module';
import { ListComponent } from './list/list.component';
import { StepEditComponent } from './step/edit/edit.component';
import { ViewComponent } from './view/view.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

const COMPONENTS = [ViewComponent, ListComponent, StepEditComponent];
const COMPONENTS_NOROUNT = [EditComponent];

@NgModule({
  imports: [SharedModule, ExprRoutingModule, DragDropModule, NzBreadCrumbModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class ExprModule {}
