import { Component, EventEmitter, Output } from '@angular/core';
import {PRIMENG_MODULES} from '../../layout/primeng/primeng';

@Component({
  selector: 'app-toolbar',
  imports: [...PRIMENG_MODULES],
  templateUrl: './toolbar.html',

})
export class Toolbar {

  @Output() action = new EventEmitter<{
    action: string;
    
  }>();

  onAction(action: string): void {

    this.action.emit({action});

  }

}
