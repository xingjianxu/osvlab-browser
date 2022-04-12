import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';

import { ExprRoutingModule } from './expr-routing.module';
import { ViewComponent } from './view/view.component';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import {NzEmptyModule} from "ng-zorro-antd/empty";

const COMPONENTS = [ViewComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
    imports: [SharedModule, ExprRoutingModule, NzTagModule, NzBreadCrumbModule, NzEmptyModule],
    declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT]
})
export class ExprModule {}
