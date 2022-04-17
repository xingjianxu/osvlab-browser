import { NgModule } from '@angular/core';
import { WidgetRegistry } from '@delon/form';
import { SharedModule } from '@shared';
import { NzCodeEditorModule } from 'ng-zorro-antd/code-editor';

import { CodeWidget } from './code-widget';

export const SFWIDGET_COMPONENTS = [CodeWidget];

@NgModule({
  declarations: SFWIDGET_COMPONENTS,
  imports: [SharedModule, NzCodeEditorModule],
  exports: [...SFWIDGET_COMPONENTS]
})
export class SFWidgetModule {
  constructor(widgetRegistry: WidgetRegistry) {
    widgetRegistry.register(CodeWidget.KEY, CodeWidget);
  }
}
