import { Component, OnInit } from '@angular/core';
import { ControlWidget } from '@delon/form';

@Component({
  selector: 'app-code-widget',
  template: `<sf-item-wrap [id]="id" [schema]="schema" [ui]="ui" [showError]="showError" [error]="error" [showTitle]="schema.title">
    <nz-code-editor class="editor" [ngModel]="value" (ngModelChange)="change($event)" [nzEditorOption]="editorOption"></nz-code-editor>
  </sf-item-wrap>`,
  styleUrls: ['./code-widget.less']
})
// tslint:disable-next-line:component-class-suffix
export class CodeWidget extends ControlWidget implements OnInit {
  /* 用于注册小部件 KEY 值 */
  static readonly KEY = 'code';

  loadingTip: string;
  loading = false;
  editorOption = {};

  ngOnInit(): void {
    this.loadingTip = this.ui.loadingTip || 'loading...';
    this.editorOption = {
      ...this.ui.editorOption,
      automaticLayout: true,
      minimap: { enabled: false },
      tabSize: 2,
      lineDecorationsWidth: '1ch',
      lineNumbersMinChars: 3,
      folding: false,
      codeLens: false,
      smoothScrolling: true,
      scrollBeyondLastLine: false,
      padding: { bottom: 5, top: 5 }
    };
  }

  // reset 可以更好的解决表单重置过程中所需要的新数据问题
  reset(value: string) {}

  change(value: string) {
    if (this.ui.change) {
      this.ui.change(value);
    }
    this.setValue(value);
  }
}
