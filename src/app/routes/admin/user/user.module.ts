import {NgModule} from '@angular/core';
import {SharedModule} from '@shared';
import {ListComponent} from './list/list.component';
import {UserRoutingModule} from './user-routing.module';
import {NzTagModule} from "ng-zorro-antd/tag";

const COMPONENTS = [ListComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
    imports: [SharedModule, UserRoutingModule, NzTagModule],
    declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT]
})
export class UserModule {
}
