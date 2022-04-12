import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { ExamModule } from './exam/exam.module';
import {ExprModule} from './exam/expr/expr.module';
import { StudentRoutingModule } from './student-routing.module';

const COMPONENTS = [];
const COMPONENTS_NOROUNT = [];

@NgModule({
    imports: [SharedModule, StudentRoutingModule, NzLayoutModule, ExprModule, ExamModule],
    declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT]
})
export class StudentModule {}
