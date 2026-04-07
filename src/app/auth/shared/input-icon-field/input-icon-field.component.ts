import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input-icon-field',
  templateUrl: './input-icon-field.component.html',
  styleUrls: ['./input-icon-field.component.css']
})
export class InputIconFieldComponent {
  @Input() label: string = '';
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() iconType: 'user' | 'lock' | 'email' | 'phone' | 'location' | 'none' = 'user';
  @Input() required: boolean = false;
  @Input() autofocus: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() errorMsg: string = '';
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.valueChange.emit(input.value);
  }
}
