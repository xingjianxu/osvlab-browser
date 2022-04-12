import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';

import { ExamRoutingModule } from './exam-routing.module';
import { ListComponent } from './list/list.component';
import {ViewComponent} from './view/view.component';
import {OsvlabPipeModule} from "../../../pipe/osvlab-pipe.module";

const COMPONENTS = [ListComponent, ViewComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
    imports: [SharedModule, ExamRoutingModule, OsvlabPipeModule],
    declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT]
})
export class ExamModule {}
