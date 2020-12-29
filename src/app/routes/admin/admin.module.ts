import {NgModule} from '@angular/core';
import {SharedModule} from '@shared';

import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {AdminRoutingModule} from './admin-routing.module';
import {LayoutAdminComponent} from './layout-admin.component';

const COMPONENTS = [LayoutAdminComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, AdminRoutingModule, NzLayoutModule, ],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class AdminModule {
}
