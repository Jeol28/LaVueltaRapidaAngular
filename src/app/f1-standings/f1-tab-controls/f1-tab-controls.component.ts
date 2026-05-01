import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-f1-tab-controls',
  templateUrl: './f1-tab-controls.component.html',
  styleUrls: ['./f1-tab-controls.component.css']
})
export class F1TabControlsComponent {
  @Input() activeTable: string = 'pilotos';
  @Output() tableChange = new EventEmitter<string>();

  onSwitch(table: string): void {
    this.tableChange.emit(table);
  }
}
