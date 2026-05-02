import { Component, Input } from '@angular/core';
import { FaqItem } from '../contacto/contacto.component';

@Component({
  selector: 'app-ct-faq-item',
  templateUrl: './ct-faq-item.component.html',
  styleUrls: ['./ct-faq-item.component.css']
})
export class CtFaqItemComponent {
  @Input() faq!: FaqItem;
  abierto = false;

  toggle(): void {
    this.abierto = !this.abierto;
  }
}
