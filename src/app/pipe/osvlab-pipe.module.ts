import { NgModule } from '@angular/core';
import { DateFormatPipe } from './date-format';

export const COMPONENTS = [DateFormatPipe];

@NgModule({
  declarations: COMPONENTS,
  imports: [],
  exports: [...COMPONENTS],
})
export class OsvlabPipeModule {}
