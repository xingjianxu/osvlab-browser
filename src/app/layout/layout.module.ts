import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { LayoutDefaultComponent } from './default/default.component';
import { HeaderUserComponent } from './default/header/components/user.component';
import { HeaderComponent } from './default/header/header.component';
import { SidebarComponent } from './default/sidebar/sidebar.component';


const COMPONENTS = [
  LayoutDefaultComponent,
  HeaderComponent,
  SidebarComponent,
];

const HEADERCOMPONENTS = [
  HeaderUserComponent,
  EditUserSecurityComponent
];

// passport
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import { LayoutPassportComponent } from './passport/passport.component';
import {EditUserSecurityComponent} from "./default/header/components/edit-user-security/edit-user-security.component";
const PASSPORT = [
  LayoutPassportComponent
];

@NgModule({
  imports: [SharedModule, NzLayoutModule],
  declarations: [
    ...COMPONENTS,
    ...HEADERCOMPONENTS,
    ...PASSPORT
  ],
  exports: [
    ...COMPONENTS,
    ...PASSPORT
  ]
})
export class LayoutModule { }
