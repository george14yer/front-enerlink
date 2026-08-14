import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import {PRIMENG_MODULES} from '../../layout/primeng/primeng';
import { TableColumn} from '../table/interface_table'
import { DatePipe,TitleCasePipe  } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [...PRIMENG_MODULES, DatePipe, TitleCasePipe ],
  templateUrl: './table.html',
  
})
export class Table {

  @Input() title = '';

  @Input() columns: TableColumn[] = [];

  @Input() dataSource: any[] = [];
  
  @Output() action = new EventEmitter<{
    action: string;
    data: any;
  }>();

  onAction(action: string, data: any): void {

    this.action.emit({
      action,
      data
    });

  }


}
