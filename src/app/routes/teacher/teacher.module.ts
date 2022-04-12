import {NgModule} from '@angular/core';
import {SharedModule} from '@shared';

import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {LayoutTeacherComponent} from './layout-teacher.component';
import {TeacherRoutingModule} from './teacher-routing.module';

const COMPONENTS = [LayoutTeacherComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
    imports: [SharedModule, TeacherRoutingModule, NzLayoutModule,],
    declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT]
})
export class TeacherModule {
}
