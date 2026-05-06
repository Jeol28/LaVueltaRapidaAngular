import { Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnChanges, Output } from '@angular/core';

export interface SelectOption { value: any; label: string; }

@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.css']
})
export class CustomSelectComponent implements OnChanges {
  @Input() value: any = null;
  @Input() disabled = false;
  @Input() placeholder = 'Selecciona una opción';
  @Input() options: (string | SelectOption)[] = [];
  @Output() valueChange = new EventEmitter<any>();

  @HostBinding('class.cs-open') isOpen = false;
  normalizedOptions: SelectOption[] = [];

  get isPlaceholder(): boolean {
    return this.normalizedOptions.find(o => o.value == this.value) === undefined;
  }

  constructor(private el: ElementRef) {}

  ngOnChanges(): void {
    this.normalizedOptions = this.options.map(o =>
      typeof o === 'string' ? { value: o, label: o } : o
    );
  }

  get selectedLabel(): string {
    const found = this.normalizedOptions.find(o => o.value == this.value);
    return found ? found.label : this.placeholder;
  }

  toggle(): void {
    if (!this.disabled) this.isOpen = !this.isOpen;
  }

  select(opt: SelectOption): void {
    this.value = opt.value;
    this.valueChange.emit(opt.value);
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}
