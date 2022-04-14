import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

import { LayoutDefaultComponent } from './default/default.component';
import { EditUserSecurityComponent } from './default/header/components/edit-user-security/edit-user-security.component';
import { HeaderUserComponent } from './default/header/components/user.component';
// eslint-disable-next-line import/order
import { HeaderComponent } from './default/header/header.component';

const COMPONENTS = [LayoutDefaultComponent, HeaderComponent];

const HEADERCOMPONENTS = [HeaderUserComponent, EditUserSecurityComponent];

// passport

import { LayoutPassportComponent } from './passport/passport.component';
const PASSPORT = [LayoutPassportComponent];

@NgModule({
  imports: [SharedModule, NzLayoutModule],
  declarations: [...COMPONENTS, ...HEADERCOMPONENTS, ...PASSPORT],
  exports: [...COMPONENTS, ...PASSPORT]
})
export class LayoutModule {}
