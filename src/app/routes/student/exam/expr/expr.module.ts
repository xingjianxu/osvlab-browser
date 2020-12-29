import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';

import { ExprRoutingModule } from './expr-routing.module';
import { ViewComponent } from './view/view.component';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

const COMPONENTS = [ViewComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, ExprRoutingModule, NzTagModule, NzBreadCrumbModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class ExprModule {}
